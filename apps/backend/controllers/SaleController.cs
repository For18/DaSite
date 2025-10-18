using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;

[DisplayName(nameof(Sale))]
public class SaleExternal {
	public SaleExternal(Sale sale) {
		Id = sale.Id;
		PurchaserId = sale.Purchaser.Id;
		PurchasedAuctionId = sale.PurchasedAuction.Id;
		Amount = sale.Amount;
		Price = sale.Price;
		IsPaid = sale.IsPaid;
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
	public ulong PurchaserId { get; set; }
	public ulong PurchasedAuctionId { get; set; }
	public int Amount { get; set; }
	public int Price { get; set; }
	public bool IsPaid { get; set; }
}

[ApiController]
[Route("sale")]
public class SaleController : ControllerBase {
	[HttpGet("{id}")]
	public ActionResult<SaleExternal> Get(ulong id) {
		using var db = new DatabaseContext();
		{
			Sale? sale = db.Sales.Find(id);
			if (sale == null) return NotFound();

			return new SaleExternal(sale);
		}
	}

	[HttpGet("/sales")]
	public ActionResult<SaleExternal[]> GetAll() {
		using (var db = new DatabaseContext()) {
			return db.Sales.Select(sale => new SaleExternal(sale)).ToArray();
		}
	}

	[HttpPost]
	public ActionResult Post(SaleExternal saleData) {
		using (var db = new DatabaseContext()) {
			if (db.Sales.Any(s => s.Id == saleData.Id)) return Conflict("Already exists");

			Sale sale = saleData.ToSale(db);

			db.Sales.Add(sale);
			db.SaveChanges();

			return Ok(new IdReference(sale.Id));
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			Sale? sale = db.Sales.Find(id);
			if (sale == null) return NoContent();

			db.Sales.Remove(sale);
			db.SaveChanges();

			return NotFound();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Update(ulong id, [FromBody] JsonPatchDocument<Sale> patchdoc) {
		using (var db = new DatabaseContext()) {
			Sale? sale = db.Sales.Find(id);
			if (sale == null) return NotFound();

			patchdoc.ApplyTo(sale, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(sale);
		}
	}
}
