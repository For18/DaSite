using System.Linq;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class ProductController : ControllerBase
{
	[HttpGet("/product/{id}")]
	public ActionResult<Product> GetProduct(long id)
	{
		using (var db = new DatabaseContext())
		{
			Product? product = db.Products.Where(product => product.Id == id).FirstOrDefault();

			if (product == null) return NotFound();

			return product;
		}
	}

	[HttpGet("/products")]
	public ActionResult<Product[]> GetProducts()
	{
		using (var db = new DatabaseContext())
		{
			Product[] products = db.Products.ToArray();

			return products;
		}
	}

	[HttpPost("/product")]
	public ActionResult PostProduct(Product product)
	{
		using (var db = new DatabaseContext())
		{
			if (db.Products.Any(p => p.Id == product.Id)) return Conflict("Already exists");

			db.Products.Add(product);
			db.SaveChanges();

			return Ok();
		}
	}
}