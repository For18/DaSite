using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

[DisplayName(nameof(AuctionEntry))]
public class AuctionEntryExternal {
  public AuctionEntryExternal(ulong auctionId, ulong itemId) {
    AuctionId = auctionId;
    ItemId = itemId;
  }

  public static AuctionEntryExternal ToExternal(AuctionEntry entry) {
    return new AuctionEntryExternal(entry.Auction.Id, entry.Product.Id);
  }

  public AuctionEntry ToAuctionEntry(DatabaseContext db) {
    return new AuctionEntry {
      Auction = db.Auctions.Include(auc => auc.Planner).Where(auc => auc.Id == auctionId),
      AuctionItem = db.AuctionItems.Include(item => item.Product).ThenInclude(prod => prod.ProductImage).Where(item => item.Id == itemId)
    };
  }

	public required ulong AuctionId { get; set; }
  public required ulong ItemId { get; set; }
}

[ApiController]
[Route("auction-entry")]
public class AuctionEntryController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<AuctionEntryExternal>> Get(ulong id) {
		using var db = new DatabaseContext();
		{

			AuctionEntry? entry = await db.AuctionEntries.Include(entry => entry.Product).ThenInclude(prod => prod.ThumbnailImage).Where(entry => entry.Id == id).FirstOrDefaultAsync();
			if (entry == null) return NotFound();

			return AuctionEntryExternal.ToExternal(entry);
		}
	}

  [HttpGet("get-by-auction/{id}")]
  public async Task<ActionResult<AuctionEntryExternal[]>> getByAuction(ulong id) {
    using var db = new DatabaseContext();
    {

      return await db.AuctionEntries
        .Include(entry => entry.Auction)
        .ThenInclude(auc => auc.Planner)
        .Include(entry => entry.AuctionItem)
        .ThenInclude(item => item.Product)
        .ThenInclude(prod => prod.ThumbnailImage)
        .Where(entry.Auction.Id == id)
        .Select(entry => AuctionEntryExternal.ToExternal(entry))
        .ToArrayAsync();
    }
  }

	[HttpPost]
	public async Task<ActionResult> Post(AuctionEntryExternal auctionEntryData) {
		using (var db = new DatabaseContext()) {

      bool isConflicting = await db.AuctionEntries
        .Include(entry => entry.Auction)
        .Include(entry => entry.AuctionItem)
        .AnyAsync(entry => entry.Auction.Id == auctionEntryData.AuctionId && entry.AuctionItem.Id == auctionEntryData.ItemId);

			if (isConflicting) return Conflict("Already exists");
			AuctionEntry entry = auctionEntryData.ToAuctionEntry(db);

			db.AuctionEntries.Add(entry);
			await db.SaveChangesAsync();

			return Ok();
		}
	}

	[HttpDelete("{id}")]
	public async Task<ActionResult> Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			AuctionEntry? entry = await db.AuctionEntries.FindAsync(id);
			if (entry == null) return NotFound();

			db.AuctionEntries.Remove(entry);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<Auction> patchdoc) {
		using (var db = new DatabaseContext()) {
			AuctionEntry? entry = await db.AuctionEntries.FindAsync(id);
			if (entry == null) return NotFound();

			patchdoc.ApplyTo(entry, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(entry);
		}
	}
}
