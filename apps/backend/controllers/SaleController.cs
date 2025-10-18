using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

[ApiController]
[Route("sale")]
public class SaleController: ControllerBase
{
	[HttpGet("{id}")]
	public ActionResult<Sale> Get(ulong id)
	{
    using var db = new DatabaseContext();
    {
      Sale? sale = db.Sales.Find(id);
      if (sale == null) return NotFound();

      return sale;
    }
	}

	[HttpGet("/sales")]
	public ActionResult<Sale[]> GetAll()
	{
    using (var db = new DatabaseContext())
    {
      Sale[] sales = db.Sales.ToArray();

      return sales;
    }
	}

	[HttpPost]
	public ActionResult Post(Sale sale)
	{
		using (var db = new DatabaseContext())
		{
			if (db.Sales.Any(s => s.Id == s.Id)) return Conflict("Already exists");

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
