using System.Threading.Tasks;
using System.Linq;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;


[DisplayName(nameof(AuctionEntry))]
public class AuctionEntryExternal {
	/* For annotation reasoning:
	 * https://stackoverflow.com/questions/76909169/required-keyword-causes-error-even-if-member-initialized-in-constructor
	 */
	[System.Diagnostics.CodeAnalysis.SetsRequiredMembersAttribute]
	public AuctionEntryExternal(ulong auctionId, ulong itemId) {
		AuctionId = auctionId;
		ItemId = itemId;
	}
	public static AuctionEntryExternal ToExternal(AuctionEntry entry) {
		return new AuctionEntryExternal(entry.Auction.Id, entry.AuctionItem.Id);
	}

	public AuctionEntry? ToAuctionEntry(DatabaseContext db) {
		Auction? auction = db.Auctions.Include(auc => auc.Planner).Where(auc => auc.Id == AuctionId).FirstOrDefault();
		AuctionItem? item = db.AuctionItems.Include(item => item.Product).ThenInclude(prod => prod.ThumbnailImage).Where(item => item.Id == ItemId).FirstOrDefault();

		if (auction == null || item == null) return null;

		return new AuctionEntry {
			Auction = auction,
			AuctionItem = item
		};
	}

	public required ulong AuctionId { get; set; }
	public required ulong ItemId { get; set; }
}

[ApiController]
[Route("auction-entry")]
public class AuctionEntryController : ControllerBase {
	[HttpGet("/auction-entries/batch")]
	public async Task<ActionResult<AuctionEntryExternal[][]>> BatchGet([FromBody] ulong[] auctionIds) {
		using (var db = new DatabaseContext()) {
			AuctionEntry[] entries = await db.AuctionEntries
			  .Include(entry => entry.Auction)
			  .ThenInclude(auc => auc.Planner)
			  .Include(entry => entry.AuctionItem)
			  .ThenInclude(item => item.Product)
			  .ThenInclude(prod => prod.ThumbnailImage)
			  .Where(entry => auctionIds.Contains(entry.Auction.Id))
			  .Select(entry => entry)
			  .ToArrayAsync();

			AuctionEntryExternal[][] groupedEntries = entries
			  .GroupBy(entry => entry.Auction.Id)
			  .Select(group =>
				  group.Select(AuctionEntryExternal.ToExternal)
				  .ToArray()
			  )
			  .ToArray();

			return Ok(groupedEntries);
		}
	}

	[HttpGet("from-auction/{auctionId}")]
	public async Task<ActionResult<AuctionEntryExternal[]>> GetFromAuction(ulong auctionId) {
		using (var db = new DatabaseContext()) {

			AuctionEntryExternal[] entries = await db.AuctionEntries
		.Include(entry => entry.AuctionItem)
		.ThenInclude(item => item.Product)
		.ThenInclude(prod => prod.ThumbnailImage)
		.Include(entry => entry.Auction)
		.ThenInclude(auc => auc.Planner)
		.Where(entry => entry.Auction.Id == auctionId)
		.Select(entry => AuctionEntryExternal.ToExternal(entry))
		.ToArrayAsync();

			return entries;
		}
	}

	[HttpGet("from-item/{itemId}")]
	public async Task<ActionResult<AuctionEntryExternal[]>> GetFromItem(ulong itemId) {
		using (var db = new DatabaseContext()) {

			AuctionEntryExternal[] entries = await db.AuctionEntries
		.Include(entry => entry.AuctionItem)
		.ThenInclude(item => item.Product)
		.ThenInclude(prod => prod.ThumbnailImage)
		.Include(entry => entry.Auction)
		.ThenInclude(auc => auc.Planner)
		.Where(entry => entry.AuctionItem.Id == itemId)
		.Select(entry => AuctionEntryExternal.ToExternal(entry))
		.ToArrayAsync();

			return entries;
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<ActionResult> Post(AuctionEntryExternal auctionEntryData) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {

			bool isConflicting = await db.AuctionEntries
			  .Include(entry => entry.Auction)
			  .Include(entry => entry.AuctionItem)
			  .AnyAsync(entry => entry.Auction.Id == auctionEntryData.AuctionId && entry.AuctionItem.Id == auctionEntryData.ItemId);

			if (isConflicting) return Conflict("Already exists");
			AuctionEntry? entry = auctionEntryData.ToAuctionEntry(db);

			if (entry == null) return NotFound();

			db.AuctionEntries.Add(entry);
			await db.SaveChangesAsync();

			return Ok();
		}
	}

	[HttpPost("/auction-entries/batch")]
	[Authorize]
	public async Task<ActionResult> BatchPost([FromBody] AuctionEntryExternal[] entriesData) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<AuctionEntryExternal>[] failedPosts = [];
			ulong[] auctionIds = entriesData.Select(entry => entry.AuctionId).ToArray();
			ulong[] itemIds = entriesData.Select(entry => entry.ItemId).ToArray();
			ulong[] foundAuctionIds = await db.Auctions.Where(auc => auctionIds.Contains(auc.Id)).Select(auc => auc.Id).ToArrayAsync();
			ulong[] foundItemIds = await db.AuctionItems.Where(item => itemIds.Contains(item.Id)).Select(item => item.Id).ToArrayAsync();

			AuctionEntryExternal[] validEntries = [];
			foreach (AuctionEntryExternal entry in entriesData) {
				if (!foundAuctionIds.Contains(entry.AuctionId)) {
					failedPosts.Append(new FailedBatchEntry<AuctionEntryExternal>(entry, "Invalid auctionId"));
				} else if (!foundItemIds.Contains(entry.ItemId)) {
					failedPosts.Append(new FailedBatchEntry<AuctionEntryExternal>(entry, "Invalid itemId"));
				} else {
					validEntries.Append(entry);
				}
			}

			foreach (AuctionEntryExternal entry in validEntries) {
				db.Add(entry);
			}

			await db.SaveChangesAsync();

			if (failedPosts.Length > 0) return StatusCode(207, new { AddedEntries = validEntries, FailedPosts = failedPosts });
			return Ok(validEntries);
		}
	}

	[HttpDelete("{auctionId}/{itemId}")]
	[Authorize]
	public async Task<ActionResult> Delete(ulong auctionId, ulong itemId) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			AuctionEntry? entry = await db.AuctionEntries
		.Include(entry => entry.Auction)
		.Include(entry => entry.AuctionItem)
		.Where(entry => entry.Auction.Id == auctionId && entry.AuctionItem.Id == itemId)
		.Select(entry => entry)
		.FirstAsync();
			if (entry == null) return NotFound();

			db.AuctionEntries.Remove(entry);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	/* TODO: decide if tuple should be split into two argument
	 * increasing clarity on which ulong is which FK in the composite key
	 *  
	 * For now tuple.Item1 = auctionId, tuple.Item2 = itemId
	 */
	[HttpDelete("/auction-entries/batch")]
	[Authorize]
	public async Task<ActionResult> BatchDelete([FromBody] Tuple<ulong, ulong>[] ids) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<Tuple<ulong, ulong>>[] failedDeletes = [];
			ulong[] auctionIds = ids.Select(entry => entry.Item1).ToArray();
			ulong[] itemIds = ids.Select(entry => entry.Item2).ToArray();
			ulong[] foundAuctionIds = await db.Auctions.Where(auc => auctionIds.Contains(auc.Id)).Select(auc => auc.Id).ToArrayAsync();
			ulong[] foundItemIds = await db.AuctionItems.Where(item => itemIds.Contains(item.Id)).Select(item => item.Id).ToArrayAsync();

			Tuple<ulong, ulong>[] validIds = [];
			foreach (Tuple<ulong, ulong> key in ids) {
				if (!foundAuctionIds.Contains(key.Item1)) {
					failedDeletes.Append(new FailedBatchEntry<Tuple<ulong, ulong>>(key, "Invalid auctionId"));
				} else if (!foundItemIds.Contains(key.Item2)) {
					failedDeletes.Append(new FailedBatchEntry<Tuple<ulong, ulong>>(key, "Invalid itemId"));
				} else {
					validIds.Append(key);
				}
			}

			foreach (Tuple<ulong, ulong> key in ids) {
				db.Remove(key);
			}
			await db.SaveChangesAsync();

			if (failedDeletes.Length > 0) return StatusCode(207, new { DeletedEntries = validIds, FailedDeletes = failedDeletes });
			return Ok(validIds);
		}
	}
}
