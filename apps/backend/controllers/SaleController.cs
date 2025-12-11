using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[DisplayName(nameof(Sale))]
public class SaleExternal {
	public SaleExternal(ulong id, string purchaserId, ulong purchasedAuctionId, uint amount, uint price, bool isPaid) {
		Id = id;
		PurchaserId = purchaserId;
		PurchasedAuctionId = purchasedAuctionId;
		Amount = amount;
		Price = price;
		IsPaid = isPaid;
	}

	public static SaleExternal ToExternal(Sale sale) {
		return new SaleExternal(sale.Id, sale.Purchaser.Id, sale.PurchasedAuction.Id, sale.Amount, sale.Price, sale.IsPaid);
	}

	public Sale ToSale(DatabaseContext db) {
		return new Sale {
			Id = Id,
			Purchaser = db.Users.Where(u => u.Id == PurchaserId).First(),
			PurchasedAuction = db.Auctions.Where(a => a.Id == PurchasedAuctionId).First(),
			Amount = Amount,
			Price = Price,
			IsPaid = IsPaid
		};
	}
	public ulong Id { get; set; }
	public string PurchaserId { get; set; }
	public ulong PurchasedAuctionId { get; set; }
	public uint Amount { get; set; }
	public uint Price { get; set; }
	public bool IsPaid { get; set; }
}

[ApiController]
[Route("sale")]
public class SaleController : ControllerBase {

	[HttpGet("{id}")]
	[Authorize]
	public async Task<ActionResult<SaleExternal>> Get(ulong id) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using var db = new DatabaseContext();
		{
			Sale? sale = await db.Sales.Include(sale => sale.PurchasedAuction).Include(sale => sale.Purchaser).Where(sale => sale.Id == id).FirstOrDefaultAsync();
			if (sale == null) return NotFound();

			return SaleExternal.ToExternal(sale);
		}
	}

	[HttpGet("by-auction/{id}")]
	[Authorize]
	public async Task<ActionResult<SaleExternal>> GetByAuction(ulong id) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using var db = new DatabaseContext();
		{
			Sale? sale = await db.Sales.Include(sale => sale.PurchasedAuction).Include(sale => sale.Purchaser).Where(sale => sale.PurchasedAuction.Id == id).FirstOrDefaultAsync();
			if (sale == null) return NotFound();

			return SaleExternal.ToExternal(sale);
		}
	}

	[HttpGet("/sales")]
	[Authorize]
	public async Task<ActionResult<SaleExternal[]>> GetAll() {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			return await db.Sales.Select(sale => SaleExternal.ToExternal(sale)).ToArrayAsync();
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<ActionResult> Post(SaleExternal saleData) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			if (await db.Sales.AnyAsync(s => s.Id == saleData.Id)) return Conflict("Already exists");

			Sale sale = saleData.ToSale(db);

			db.Sales.Add(sale);
			await db.SaveChangesAsync();

			return Ok(new IdReference<ulong>(sale.Id));
		}
	}

	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult> Delete(ulong id) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			Sale? sale = await db.Sales.FindAsync(id);
			if (sale == null) return NoContent();

			db.Sales.Remove(sale);
			await db.SaveChangesAsync();

			return NotFound();
		}
	}

	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<Sale> patchdoc) {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			Sale? sale = await db.Sales.FindAsync(id);
			if (sale == null) return NotFound();

			patchdoc.ApplyTo(sale, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(sale);
		}
	}
}
