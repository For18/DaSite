using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

[DisplayName(nameof(Auction))]
public class AuctionExternal {
	public AuctionExternal(ulong id, ushort count, uint batchSize, uint startPrice, uint minPrice, ulong? startTime, uint? length, ulong productId, string? plannerId) {
		Id = id;
		Count = count;
		BatchSize = batchSize;
		StartingPrice = startPrice;
		MinimumPrice = minPrice;
		StartingTime = startTime;
		Length = length;
		ProductId = productId;
		PlannerId = plannerId;
	}

	public static AuctionExternal ToExternal(Auction auction) {
		return new AuctionExternal(auction.Id, auction.Count, auction.BatchSize, auction.StartingPrice, auction.MinimumPrice, auction.StartingTime, auction.Length, auction.Product.Id, auction.Planner?.Id);
	}

	public Auction ToAuction(DatabaseContext db) {
		return new Auction {
			Id = Id,
			Count = Count,
			BatchSize = BatchSize,
			StartingPrice = StartingPrice,
			MinimumPrice = MinimumPrice,
			StartingTime = StartingTime,
			Length = Length,
			Product = db.Products.Where(p => p.Id == ProductId).First(),
			Planner = db.Users.Where(u => u.Id == PlannerId).FirstOrDefault()
		};
	}
	public ulong Id { get; init; }
	public ushort Count { get; init; }
	public uint BatchSize { get; init; }
	public uint StartingPrice { get; init; }
	public uint MinimumPrice { get; init; }
	public ulong? StartingTime { get; init; }
	public uint? Length { get; init; }
	public ulong ProductId { get; init; }
	public string? PlannerId { get; init; }
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
				.Where(auc => auc.StartingTime != null && auc.Length != null)
				.Select(auction => AuctionExternal.ToExternal(auction))
			.ToArrayAsync();
		}
	}

	[HttpGet("/auctions/pending")]
	public async Task<ActionResult<AuctionExternal[]>> GetPending() {
		using (var db = new DatabaseContext()) {
			return await db.Auctions
				.Include(auc => auc.Planner)
				.Include(auc => auc.Product)
				.Where(auc => auc.StartingTime == null || auc.Length == null)
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

			return Ok(new IdReference<ulong>(auction.Id));
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
