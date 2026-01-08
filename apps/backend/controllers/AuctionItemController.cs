using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System;
using Microsoft.AspNetCore.Authorization;

[DisplayName(nameof(AuctionItem))]
public class AuctionItemExternal {
	/* For annotation reasoning:
	 * https://stackoverflow.com/questions/76909169/required-keyword-causes-error-even-if-member-initialized-in-constructor
	 */
	[System.Diagnostics.CodeAnalysis.SetsRequiredMembersAttribute]
	public AuctionItemExternal(ulong id, ushort count, uint batchSize, uint startingPrice, uint minimumPrice, uint length, string ownerId, ulong productId) {
		Id = id;
		Count = count;
		BatchSize = batchSize;
		StartingPrice = startingPrice;
		MinimumPrice = minimumPrice;
		OwnerId = ownerId;
		Length = length;
		ProductId = productId;
	}

	public static AuctionItemExternal ToExternal(AuctionItem item) {
		return new AuctionItemExternal(item.Id, item.Count, item.BatchSize, item.StartingPrice, item.MinimumPrice, item.Length, item.Owner.Id, item.Product.Id);
	}

	public AuctionItem? ToAuctionItem(DatabaseContext db) {
		Product? product = db.Products.Include(prod => prod.ThumbnailImage).Where(prod => prod.Id == ProductId).FirstOrDefault();
		User? owner = db.Users.Where(user => user.Id == OwnerId).FirstOrDefault();
		if (product == null || owner == null) return null;

		return new AuctionItem {
			Id = Id,
			Count = Count,
			BatchSize = BatchSize,
			StartingPrice = StartingPrice,
			MinimumPrice = MinimumPrice,
			Length = Length,
			Owner = owner,
			Product = product
		};
	}

	public required ulong Id { get; set; }
	public required ushort Count { get; set; }
	public required uint BatchSize { get; set; }
	public required uint StartingPrice { get; set; }
	public required uint MinimumPrice { get; set; }
	public required string OwnerId { get; set; }
	public required uint Length { get; set; }
	public required ulong ProductId { get; set; }
}

[ApiController]
[Route("auction-item")]
public class AuctionItemController : ControllerBase {

	[HttpGet("all")]
	public async Task<ActionResult<AuctionItemExternal[]>> GetAll() {
		using (var db = new DatabaseContext()) {
			return await db.AuctionItems
			  .Include(item => item.Product)
			  .ThenInclude(prod => prod.ThumbnailImage)
			  .Select(item => AuctionItemExternal.ToExternal(item))
			  .ToArrayAsync();
		}
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<AuctionItemExternal>> Get(ulong id) {
		using (var db = new DatabaseContext()) {

			AuctionItem? item = await db.AuctionItems.Include(item => item.Product).ThenInclude(prod => prod.ThumbnailImage).Where(item => item.Id == id).FirstOrDefaultAsync();
			if (item == null) return NotFound();

			return AuctionItemExternal.ToExternal(item);
		}
	}

	[HttpGet("auction-items/batch")]
	public async Task<ActionResult<AuctionItemExternal[]>> BatchGet([FromBody] ulong[] ids) {
		using (var db = new DatabaseContext()) {
			return await db.AuctionItems
			  .Include(auc => auc.Product)
			  .ThenInclude(prod => prod.ThumbnailImage)
			  .Where(auc => ids.Contains(auc.Id))
			  .Select(auc => AuctionItemExternal.ToExternal(auc))
			  .ToArrayAsync();
		}
	}

	[HttpGet("by-auction/{id}")]
	public async Task<ActionResult<AuctionItemExternal[]>> GetByAuction(ulong id) {
		using (var db = new DatabaseContext()) {
			return await db.AuctionEntries
			  .Include(entry => entry.Auction)
			  .Include(entry => entry.AuctionItem)
			  .ThenInclude(ae => ae.Product)
			  .ThenInclude(prod => prod.ThumbnailImage)
		.Include(entry => entry.AuctionItem.Owner)
		.Include(entry => entry.AuctionItem)
		.ThenInclude(item => item.Owner)
			  .Select(entry => AuctionItemExternal.ToExternal(entry.AuctionItem))
			  .ToArrayAsync();
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<ActionResult> Post(AuctionItemExternal auctionItemData) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {

			if (await db.AuctionItems.AnyAsync(auc => auc.Id == auctionItemData.Id)) return Conflict("Already exists");
			AuctionItem? item = auctionItemData.ToAuctionItem(db);
			if (item == null) return NotFound();

			db.AuctionItems.Add(item);
			await db.SaveChangesAsync();

			return Ok(new IdReference<ulong>(item.Id));
		}
	}

	[HttpPost("/auction-items/batch")]
	[Authorize]
	public async Task<ActionResult> BatchPost([FromBody] AuctionItemExternal[] itemsData) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<AuctionItemExternal>[] failedPosts = [];

			ulong[] itemIds = itemsData.Select(item => item.Id).ToArray();
			ulong[] existingItems = await db.AuctionItems
			  .Where(item => itemIds.Contains(item.Id))
			  .Select(item => item.Id)
			  .ToArrayAsync();

			AuctionItem[] newItems = [];
			foreach (AuctionItemExternal item in itemsData) {
				if (existingItems.Contains(item.Id)) {
					failedPosts.Append(new FailedBatchEntry<AuctionItemExternal>(item, "Conflict item already exists"));
				} else {
					newItems.Append(item.ToAuctionItem(db));
				}
			}

			foreach (AuctionItem item in newItems) {
				db.AuctionItems.Add(item);
			}

			await db.SaveChangesAsync();

			if (failedPosts.Length > 0) {
				return StatusCode(207, new { PostedItems = newItems.Select(item => new IdReference<ulong>(item.Id)).ToArray(), FailedPosts = failedPosts });
			}
			return Ok(newItems.Select(item => new IdReference<ulong>(item.Id)).ToArray());
		}
	}

	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult> Delete(ulong id) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			AuctionItem? item = await db.AuctionItems.FindAsync(id);
			if (item == null) return NotFound();

			db.AuctionItems.Remove(item);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpDelete("/auction-items/batch")]
	[Authorize]
	public async Task<ActionResult> BatchDelete(ulong[] ids) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<ulong>[] failedDeletes = [];

			AuctionItem[] existingItems = await db.AuctionItems
			  .Where(item => ids.Contains(item.Id))
			  .ToArrayAsync();

			ulong[] existingItemIds = existingItems.Select(item => item.Id).ToArray();
			foreach (ulong id in ids) {
				if (!existingItemIds.Contains(id)) {
					failedDeletes.Append(new FailedBatchEntry<ulong>(id, "Item not found"));
				}
			}

			foreach (AuctionItem item in existingItems) {
				db.AuctionItems.Remove(item);
			}

			await db.SaveChangesAsync();

			if (failedDeletes.Length > 0) return StatusCode(207, new { DeletedItems = existingItemIds, FailedDeletes = failedDeletes });
			return Ok(existingItemIds);
		}
	}

	[HttpPatch("{id}")]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<AuctionItem> patchdoc) {
		using (var db = new DatabaseContext()) {
			AuctionItem? item = await db.AuctionItems.FindAsync(id);
			if (item == null) return NotFound();

			patchdoc.ApplyTo(item, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(item);
		}
	}
}
