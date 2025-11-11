using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

[DisplayName(nameof(Sale))]
public class SaleExternal
{
	public SaleExternal(ulong id, ulong purchaserId, ulong purchasedAuctionId, uint amount, uint price, bool isPaid)
	{
		Id = id;
		PurchaserId = purchaserId;
		PurchasedAuctionId = purchasedAuctionId;
		Amount = amount;
		Price = price;
		IsPaid = isPaid;
	}

	public static SaleExternal ToExternal(Sale sale)
	{
		return new SaleExternal(sale.Id, sale.Purchaser.Id, sale.PurchasedAuction.Id, sale.Amount, sale.Price, sale.IsPaid);
	}

	public Sale ToSale(DatabaseContext db)
	{
		return new Sale
		{
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
	public uint Amount { get; set; }
	public uint Price { get; set; }
	public bool IsPaid { get; set; }
}

[ApiController]
[Route("sale")]
public class SaleController : ControllerBase
{

	[HttpGet("{id}")]
	public ActionResult<SaleExternal> Get(ulong id)
	{
		using var db = new DatabaseContext();
		{
			Sale? sale = db.Sales.Include(sale => sale.PurchasedAuction).Include(sale => sale.Purchaser).Where(sale => sale.Id == id).FirstOrDefault();
			if (sale == null) return NotFound();

			return SaleExternal.ToExternal(sale);
		}
	}

	[HttpGet("by-auction/{id}")]
	public ActionResult<SaleExternal> GetByAuction(ulong id) {
		using var db = new DatabaseContext();
		{
			Sale? sale = db.Sales.Include(sale => sale.PurchasedAuction).Include(sale => sale.Purchaser).Where(sale => sale.PurchasedAuction.Id == id).FirstOrDefault();
			if (sale == null) return NotFound();

			return SaleExternal.ToExternal(sale);
		}
	}

	[HttpGet("/sales")]
	public ActionResult<SaleExternal[]> GetAll()
	{
		using (var db = new DatabaseContext())
		{
			return db.Sales.Select(sale => SaleExternal.ToExternal(sale)).ToArray();
		}
	}

	[HttpPost]
	public ActionResult Post(SaleExternal saleData)
	{
		using (var db = new DatabaseContext())
		{
			if (db.Sales.Any(s => s.Id == saleData.Id)) return Conflict("Already exists");

			Sale sale = saleData.ToSale(db);

			db.Sales.Add(sale);
			db.SaveChanges();

			return Ok(new IdReference(sale.Id));
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id)
	{
		using (var db = new DatabaseContext())
		{
			Sale? sale = db.Sales.Find(id);
			if (sale == null) return NoContent();

			db.Sales.Remove(sale);
			db.SaveChanges();

			return NotFound();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Update(ulong id, [FromBody] JsonPatchDocument<Sale> patchdoc)
	{
		using (var db = new DatabaseContext())
		{
			Sale? sale = db.Sales.Find(id);
			if (sale == null) return NotFound();

			patchdoc.ApplyTo(sale, ModelState);

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(sale);
		}
	}
}
