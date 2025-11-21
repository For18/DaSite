using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

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

  public AuctionEntry ToAuctionEntry(DatabaseContext db) {
    return new AuctionEntry {
      Auction = db.Auctions.Include(auc => auc.Planner).Where(auc => auc.Id == AuctionId).FirstOrDefault(),
      AuctionItem = db.AuctionItems.Include(item => item.Product).ThenInclude(prod => prod.ThumbnailImage).Where(item => item.Id == ItemId).FirstOrDefault()
    };
  }

	public required ulong AuctionId { get; set; }
  public required ulong ItemId { get; set; }
}

[ApiController]
[Route("auction-entry")]
public class AuctionEntryController : ControllerBase {
	[HttpGet("{auctionId}/{itemId}")]
	public async Task<ActionResult<AuctionEntryExternal>> Get(ulong auctionId, ulong itemId) {
		using var db = new DatabaseContext();
		{

			AuctionEntry? entry = await db.AuctionEntries
        .Include(entry => entry.AuctionItem)
        .ThenInclude(item => item.Product)
        .ThenInclude(prod => prod.ThumbnailImage)
        .Include(entry => entry.Auction)
        .ThenInclude(auc => auc.Planner)
        .Where(entry => entry.AuctionItem.Id == itemId && entry.Auction.Id == auctionId)
        .FirstOrDefaultAsync();
			if (entry == null) return NotFound();

			return AuctionEntryExternal.ToExternal(entry);
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
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<AuctionEntry> patchdoc) {
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
