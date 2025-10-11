using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

[ApiController]
[Route("product")]
public class ProductController : ControllerBase
{
	[HttpGet("{id}")]
	public ActionResult<Product> Get(ulong id)
	{
		using (var db = new DatabaseContext())
		{
			Product? product = db.Products.Where(product => product.Id == id).FirstOrDefault();

			if (product == null) return NotFound();

			return product;
		}
	}

	[HttpGet("/products")]
	public ActionResult<Product[]> GetAll()
	{
		using (var db = new DatabaseContext())
		{
			Product[] products = db.Products.ToArray();

			return products;
		}
	}

	[HttpPost]
	public ActionResult Post(Product product)
	{
		using (var db = new DatabaseContext())
		{
			if (db.Products.Any(prod => prod.Id == product.Id)) return Conflict("Already exists");

			db.Products.Add(product);
			db.SaveChanges();

			return Ok();
		}
	}

  [HttpDelete]
  public ActionResult Delete(ulong id)
  {
    using (var db = new DatabaseContext())
    {
      Product? product = db.Products.Find(id);
      if (product == null) return NotFound();

      db.Products.Remove(product);
      db.SaveChanges();

      return NoContent();
    }
  }

  [HttpPatch]
  public ActionResult Patch(ulong id, [FromBody] JsonPatchDocument<Product> patchdoc)
  {
    using (var db = new DatabaseContext())
    {
      Product? product = db.Products.Find(id);
      if (product == null) return NotFound();

      patchdoc.ApplyTo(product, ModelState);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.SaveChanges();
      return Ok(product);
    }
  }
}
