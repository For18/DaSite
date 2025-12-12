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
		using (var db = new DatabaseContext())
		{

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
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		ulong unixTimeMillis = (ulong)DateTimeOffset.Now.ToUnixTimeMilliseconds();
		using (var db = new DatabaseContext()) {
			return await db.Auctions
				.Include(auc => auc.Planner)
				.Where(auc => auc.StartingTime > unixTimeMillis)
				.Select(auction => AuctionExternal.ToExternal(auction))
			.ToArrayAsync();
		}
	}

  [HttpPost("/auctions/batch")]
  public async Task<ActionResult> BatchPost(AuctionExternal[] auctionsData) {
    using (var db = new DatabaseContext()) {
      FailedBatchEntry<AuctionExternal>[] failedPost = [];

      Auction[] auctions = auctionsData.Select(auc => auc.ToAuction(db)).ToArray();

      ulong[] auctionIds = auctionsData.Select(auc => auc.Id).ToArray();
      AuctionExternal[] existingAuctions = await db.Auctions
        .Where(auc => auctionIds.Contains(auc.Id))
        .Select(auc => AuctionExternal.ToExternal(auc))
        .ToArrayAsync();

      IdReference[] newAuctions = [];

      foreach(AuctionExternal entry in auctionsData) {
        if (existingAuctions.Contains(entry)) {
          failedPost.Append(new FailedBatchEntry<AuctionExternal>(entry, "Conflict, auction already exists"));
        } else {
          db.Add(entry);
          newAuctions.Append(new IdReference(entry.Id));
        }
      }

      await db.SaveChangesAsync();

      return Ok(new {
        AddedAuctions = newAuctions,
        FailedAuctions = failedPost
      });
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
