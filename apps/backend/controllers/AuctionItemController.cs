using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

[DisplayName(nameof(AuctionItem))]
public class AuctionItemExternal {
  public AuctionItemExternal(ulong id, ushort count, uint batchSize, uint startingPrice, uint minimumPrice, ulong length, ulong productId) {
    Id = id;
    Count = count;
    BatchSize = batchSize;
    StartingPrice = startingPrice;
    MinimumPrice = minimumPrice;
    Length = length;
    ProductId = productId;
  }

  public static AuctionItemExternal ToExternal(AuctionItem item) {
    return new AuctionItemExternal(item.Id, item.Count, item.BatchSize, item.StartingPrice, item.MinimumPrice, item.Length, item.Product?.Id);
  }

  public AuctionItem ToAuctionItem(Databasecontext db) {
    return new AuctionItem{
      Id = Id,
      Count = Count,
      BatchSize = BatchSize,
      StartingPrice = StartingPrice,
      MinimumPrice = MinimumPrice,
      Length = Length,
      Product = db.Products.Include(prod => prod.ProductImage).Where(prod => prod.Id == ProductId)
    };
  }

	public required ulong Id { get; set; }
	public required ushort Count { get; set; }
	public required uint BatchSize { get; set; }
	public required uint StartingPrice { get; set; }
	public required uint MinimumPrice { get; set; }
  public required uint Length { get; set; }
  public required Product ProductId { get; set; }
}

[ApiController]
[Route("auction-item")]
public class AuctionController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<AuctionItemExternal>> Get(ulong id) {
		using var db = new DatabaseContext();
		{

			AuctionItem? item = await db.AuctionItems.Include(item => item.Product).Where(item => item.Id == id).FirstOrDefaultAsync();
			if (item == null) return NotFound();

			return AuctionItemExternal.ToExternal(item);
		}
	}

	[HttpPost]
	public async Task<ActionResult> Post(AuctionItemExternal auctionItemData) {
		using (var db = new DatabaseContext()) {

			if (await db.AuctionItems.AnyAsync(auc => auc.Id == auctionData.Id)) return Conflict("Already exists");
			AuctionItem item = auctionItemData.ToAuctionItem(db);

			db.AuctionItems.Add(auctionItemData);
			await db.SaveChangesAsync();

			return Ok(new IdReference(item.Id));
		}
	}

	[HttpDelete("{id}")]
	public async Task<ActionResult> Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			AuctionItem? item = await db.AuctionItems.FindAsync(id);
			if (item == null) return NotFound();

			db.AuctionItems.Remove(item);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<Auction> patchdoc) {
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
