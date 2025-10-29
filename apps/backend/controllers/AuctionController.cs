using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;

[DisplayName(nameof(Auction))]
public class AuctionExternal {
	public AuctionExternal(ulong id, ushort count, uint batchSize, uint startPrice, uint minPrice, ulong startTime, uint length, ulong productId, ulong? plannerId) {
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
	public AuctionExternal(Auction auction)
	  : this(auction.Id, auction.Count, auction.BatchSize, auction.StartingPrice, auction.MinimumPrice, auction.StartingTime, auction.Length, auction.Product.Id, auction.Planner?.Id) { }

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
			Planner = (PlannerId == null ? null : db.Users.Where(u => u.Id == PlannerId).FirstOrDefault()),
		};
	}
	public ulong Id { get; init; }
	public ushort Count { get; init; }
	public uint BatchSize { get; init; }
	public uint StartingPrice { get; init; }
	public uint MinimumPrice { get; init; }
	public ulong StartingTime { get; init; }
	public uint Length { get; init; }
	public ulong ProductId { get; init; }
	public ulong? PlannerId { get; init; }
}

[ApiController]
[Route("auction")]
public class AuctionController : ControllerBase {
	[HttpGet("{id}")]
	public ActionResult<AuctionExternal> Get(ulong id) {
		using var db = new DatabaseContext();
		{

			Auction? auction = db.Auctions.Find(id);
			if (auction == null) return NotFound();

			return new AuctionExternal(auction);
		}
	}

	[HttpGet("/auctions")]
	public ActionResult<AuctionExternal[]> GetAll() {
		using (var db = new DatabaseContext()) {
			return db.Auctions.Select(auction => new AuctionExternal(auction)).ToArray();
		}
	}

	[HttpPost]
	public ActionResult Post(AuctionExternal auctionData) {
		using (var db = new DatabaseContext()) {

			if (db.Auctions.Any(auc => auc.Id == auctionData.Id)) return Conflict("Already exists");
			Auction auction = auctionData.ToAuction(db);

			db.Auctions.Add(auction);
			db.SaveChanges();

			return Ok(new IdReference(auction.Id));
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			Auction? auction = db.Auctions.Find(id);
			if (auction == null) return NotFound();

			db.Auctions.Remove(auction);
			db.SaveChanges();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Update(ulong id, [FromBody] JsonPatchDocument<Auction> patchdoc) {
		using (var db = new DatabaseContext()) {
			Auction? auction = db.Auctions.Find(id);
			if (auction == null) return NotFound();

			patchdoc.ApplyTo(auction, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(auction);
		}
	}
}
