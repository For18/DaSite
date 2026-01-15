using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[DisplayName(nameof(Auction))]
public class AuctionExternal {
	/* For annotation reasoning:
	 * https://stackoverflow.com/questions/76909169/required-keyword-causes-error-even-if-member-initialized-in-constructor
	 */
	[System.Diagnostics.CodeAnalysis.SetsRequiredMembersAttribute]
	public AuctionExternal(ulong id, ulong startingTime, string? plannerId) {
		Id = id;
		StartingTime = startingTime;
		PlannerId = plannerId;
	}

	public static AuctionExternal ToExternal(Auction auction) {
		return new AuctionExternal(auction.Id, auction.StartingTime, auction.Planner?.Id);
	}

	public Auction ToAuction(DatabaseContext db) {
		return new Auction {
			Id = Id,
			StartingTime = StartingTime,
			Planner = db.Users.Where(u => u.Id == PlannerId).FirstOrDefault()
		};
	}
	public required ulong Id { get; init; }
	public required ulong StartingTime { get; init; }
	public string? PlannerId { get; init; }
}

[ApiController]
[Route("auction")]
public class AuctionController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<AuctionExternal>> Get(ulong id) {
		using (var db = new DatabaseContext()) {

			Auction? auction = await db.Auctions.Include(auc => auc.Planner).Where(auc => auc.Id == id).FirstOrDefaultAsync();
			if (auction == null) return NotFound();

			return AuctionExternal.ToExternal(auction);
		}
	}

	[HttpGet("/auctions/batch")]
	public async Task<ActionResult<AuctionExternal[]>> BatchGet([FromBody] ulong[] ids) {
		using (var db = new DatabaseContext()) {
			return await db.Auctions
			  .Include(auc => auc.Planner)
			  .Where(auc => ids.Contains(auc.Id))
			  .Select(auc => AuctionExternal.ToExternal(auc))
			  .ToArrayAsync();
		}
	}

	[HttpGet("/auctions")]
	public async Task<ActionResult<AuctionExternal[]>> GetNormal() {
		using (var db = new DatabaseContext()) {
			return await db.Auctions
				.Include(auc => auc.Planner)
				.Select(auction => AuctionExternal.ToExternal(auction))
			.ToArrayAsync();
		}
	}

	[HttpGet("/auctions/upcoming")]
	[Authorize]
	public async Task<ActionResult<AuctionExternal[]>> GetUpcoming() {
		ulong unixTimeMillis = (ulong)DateTimeOffset.Now.ToUnixTimeMilliseconds();
		using (var db = new DatabaseContext()) {
			return await db.Auctions
				.Include(auc => auc.Planner)
				.Where(auc => auc.StartingTime > unixTimeMillis)
				.Select(auction => AuctionExternal.ToExternal(auction))
			.ToArrayAsync();
		}
	}

	[HttpGet("next")]
	[Authorize]
	public async Task<ActionResult<ulong?>> GetNext() {
		ulong unixTimeMillis = (ulong)DateTimeOffset.Now.ToUnixTimeMilliseconds();
		using (var db = new DatabaseContext()) {
			try {
				return await db.Auctions
					.Where(auction => auction.StartingTime > unixTimeMillis)
					.OrderBy(auction => auction.StartingTime)
					.Select(auction => auction.Id)
				.FirstAsync();
			} catch (InvalidOperationException) { // FirstAsync() errors because there is no next auction
				return Ok(null);
			}
		}
	}

	[HttpPost("/auctions/batch")]
	[Authorize]
	public async Task<ActionResult> BatchPost(AuctionExternal[] auctionsData) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<AuctionExternal>[] failedPost = [];

			Auction[] auctions = auctionsData.Select(auc => auc.ToAuction(db)).ToArray();

			ulong[] auctionIds = auctionsData.Select(auc => auc.Id).ToArray();
			AuctionExternal[] existingAuctions = await db.Auctions
			  .Where(auc => auctionIds.Contains(auc.Id))
			  .Select(auc => AuctionExternal.ToExternal(auc))
			  .ToArrayAsync();

			IdReference<ulong>[] newAuctions = [];

			foreach (AuctionExternal entry in auctionsData) {
				if (existingAuctions.Contains(entry)) {
					failedPost.Append(new FailedBatchEntry<AuctionExternal>(entry, "Conflict, auction already exists"));
				} else {
					db.Add(entry);
					newAuctions.Append(new IdReference<ulong>(entry.Id));
				}
			}

			await db.SaveChangesAsync();

			if (failedPost.Length > 0) {
				return StatusCode(207, new {
					AddedAuctions = newAuctions,
					FailedAuctions = failedPost
				});
			}

			return Ok(newAuctions);
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<ActionResult> Post(AuctionExternal auctionData) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {

			if (await db.Auctions.AnyAsync(auc => auc.Id == auctionData.Id)) return Conflict("Already exists");
			Auction auction = auctionData.ToAuction(db);

			db.Auctions.Add(auction);
			await db.SaveChangesAsync();

			return Ok(new IdReference<ulong>(auction.Id));
		}
	}

	[HttpDelete("/auctions/batch")]
	[Authorize]
	public async Task<ActionResult> BatchDelete([FromBody] ulong[] ids) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<ulong>[] failedDeletes = [];

			Auction[] auctions = await db.Auctions.Where(auc => ids.Contains(auc.Id)).Select(auc => auc).ToArrayAsync();
			ulong[] foundIds = auctions.Select(auc => auc.Id).ToArray();
			foreach (ulong aucId in ids) {
				if (!foundIds.Contains(aucId)) failedDeletes.Append(new FailedBatchEntry<ulong>(aucId, "Corresponding Auction does not exist"));
				else {
					db.Auctions.Remove(
						auctions.Where(auc => auc.Id == aucId).First()
					);
				}
			}

			await db.SaveChangesAsync();

			if (failedDeletes.Length > 0) return StatusCode(207, new { FailedDeletes = failedDeletes });
			return NoContent();
		}
	}

	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult> Delete(ulong id) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			Auction? auction = await db.Auctions.Where(auc => auc.Id == id).Include(auc => auc.Planner).FirstOrDefaultAsync();
			if (auction == null) return NotFound();
			if (auction.Planner != null && User.FindFirstValue(ClaimTypes.NameIdentifier) != auction.Planner.Id && !User.IsInRole("Admin")) return Forbid();

			db.Auctions.Remove(auction);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<Auction> patchdoc) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			Auction? auction = await db.Auctions.Where(auc => auc.Id == id).Include(auc => auc.Planner).FirstOrDefaultAsync();
			if (auction == null) return NotFound();
			if (auction.Planner != null && User.FindFirstValue(ClaimTypes.NameIdentifier) != auction.Planner.Id && !User.IsInRole("Admin")) return Forbid();

			patchdoc.ApplyTo(auction, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(auction);
		}
	}
}
