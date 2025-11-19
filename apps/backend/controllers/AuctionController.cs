using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

[DisplayName(nameof(Auction))]
public class AuctionExternal {
  public AuctionExternal(ulong id, ulong? startingTime, ulong? plannerId) {
    Id = id;
    StartingTime = startingTime;
    PlannerId = plannerId;
  }

  public static AuctionExternal ToExternal(Auction auction) {
    return new AuctionExternal(auction.Id, auction.StartingTime, auction.Planner?.Id);
  }

  public Auction ToAuction(Databasecontext db) {
    return new Auction {
      Id = Id,
      StartingTime = StartingTime,
      PlannerId = db.Users.Where(u => u.Id == PlannerId)
    };
  }
	public ulong Id { get; init; }
	public ulong? StartingTime { get; init; }
	public ulong? PlannerId { get; init; }
}

[ApiController]
[Route("auction")]
public class AuctionController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<AuctionExternal>> Get(ulong id) {
		using var db = new DatabaseContext();
		{

			Auction? auction = await db.Auctions.Include(auc => auc.Planner).Include(auc => auc.Product).Where(auc => auc.Id == id).FirstOrDefaultAsync();
			if (auction == null) return NotFound();

			return AuctionExternal.ToExternal(auction);
		}
	}

	[HttpGet("/auctions")]
	public async Task<ActionResult<AuctionExternal[]>> GetNormal() {
		using (var db = new DatabaseContext()) {
			return await db.Auctions
				.Include(auc => auc.Planner)
				.Include(auc => auc.Product)
				.Where(auc => auc.StartingTime != null)
				.Select(auction => AuctionExternal.ToExternal(auction))
			.ToArrayAsync();
		}
	}

	[HttpGet("/auctions/pending")]
	public async Task<ActionResult<AuctionExternal[]>> GetPending() {
		using (var db = new DatabaseContext()) {
			return await db.Auctions
				.Include(auc => auc.Planner)
				.Where(auc => auc.StartingTime == null)
				.Select(auction => AuctionExternal.ToExternal(auction))
			.ToArrayAsync();
		}
	}

	[HttpPost]
	public async Task<ActionResult> Post(AuctionExternal auctionData) {
		using (var db = new DatabaseContext()) {

			if (await db.Auctions.AnyAsync(auc => auc.Id == auctionData.Id)) return Conflict("Already exists");
			Auction auction = auctionData.ToAuction(db);

			db.Auctions.Add(auction);
			await db.SaveChangesAsync();

			return Ok(new IdReference(auction.Id));
		}
	}

	[HttpDelete("{id}")]
	public async Task<ActionResult> Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			Auction? auction = await db.Auctions.FindAsync(id);
			if (auction == null) return NotFound();

			db.Auctions.Remove(auction);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<Auction> patchdoc) {
		using (var db = new DatabaseContext()) {
			Auction? auction = await db.Auctions.FindAsync(id);
			if (auction == null) return NotFound();

			patchdoc.ApplyTo(auction, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(auction);
		}
	}
}
