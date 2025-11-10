using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;

[DisplayName(nameof(Product))]
public class ProductExternal
{
	public ProductExternal(ulong id, string name, string? description, ulong? thumbnailImageId, ulong ownerId)
	{
		Id = id;
		Name = name;
		Description = description;
		ThumbnailImageId = thumbnailImageId;
		OwnerId = ownerId;
	}

	public static ProductExternal ToExternal(Product product)
	{
		return new ProductExternal(product.Id, product.Name, product.Description, product.ThumbnailImage?.Id, product.Owner.Id);
	}

	public Product ToProduct(DatabaseContext db)
	{
		return new Product
		{
			Id = Id,
			Name = Name,
			Description = Description,
			ThumbnailImage = db.ProductImages.Where(i => i.Id == ThumbnailImageId).FirstOrDefault(),
			Owner = db.Users.Where(u => u.Id == OwnerId).First()
		};
	}
	public ulong Id { get; init; }
	public string Name { get; init; }
	public string? Description { get; init; }
	public ulong? ThumbnailImageId { get; init; }
	public ulong OwnerId { get; init; }
}

[ApiController]
[Route("product")]
public class ProductController : ControllerBase
{
	[HttpGet("{id}")]
	public ActionResult<ProductExternal> Get(ulong id)
	{
		using (var db = new DatabaseContext())
		{
			Product? product = db.Products.Include(product => product.Owner).Where(product => product.Id == id).FirstOrDefault();

			if (product == null) return NotFound();

			return ProductExternal.ToExternal(product);
		}
	}

	[HttpGet("/products")]
	public ActionResult<ProductExternal[]> GetAll()
	{
		using (var db = new DatabaseContext())
		{
			return db.Products.Include(product => product.Owner).Select(product => ProductExternal.ToExternal(product)).ToArray();
		}
	}
	[HttpGet("/products/user/{userId}")]
	public ActionResult<ProductExternal[]> GetOfUser(ulong userId)
	{
		using (var db = new DatabaseContext())
		{
			return db.Products
				.Include(product => product.Owner)
				.Where(product => product.Owner.Id == userId)
				.Select(product => ProductExternal.ToExternal(product))
			.ToArray();
		}
	}

	[HttpPost]
	public ActionResult Post(ProductExternal productData)
	{
		using (var db = new DatabaseContext())
		{
			if (db.Products.Any(prod => prod.Id == productData.Id)) return Conflict("Already exists");

			Product product = productData.ToProduct(db);

			db.Products.Add(product);
			db.SaveChanges();

			return Ok(new IdReference(product.Id));
		}
	}

	[HttpDelete("{id}")]
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

	[HttpPatch("{id}")]
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

