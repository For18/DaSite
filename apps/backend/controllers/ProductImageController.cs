using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

[DisplayName(nameof(ProductImage))]
public class ProductImageExternal
{
	public ProductImageExternal(ulong id, ulong parentId, string url)
	{
		Id = id;
		Parent = parentId;
		Url = url;
	}

	public static ProductImageExternal ToExternal(ProductImage prodImage)
	{
		return new ProductImageExternal(prodImage.Id, prodImage.Parent.Id, prodImage.Url);
	}

	public ProductImage ToProductImage(DatabaseContext db)
	{
		return new ProductImage
		{
			Id = Id,
			Parent = db.Products.Where(parent => parent.Id == Id).First(),
			Url = Url
		};
	}
	public ulong Id { get; init; }
	public ulong Parent { get; init; }
	public string Url { get; init; }
}


[ApiController]
[Route("product-image")]
public class ProductImageController : ControllerBase
{
	[HttpGet("{id}")]
	public ActionResult<ProductImageExternal> Get(ulong id)
	{
		using (var db = new DatabaseContext())
		{
			ProductImage? prodImage = db.ProductImages.Include(prod => prod.Parent).Where(image => image.Id == id).FirstOrDefault();

			if (prodImage == null) return NotFound();

			return ProductImageExternal.ToExternal(prodImage);
		}
	}

	[HttpPost]
	public ActionResult Post(ProductImageExternal productImageData)
	{
		using (var db = new DatabaseContext())
		{
			if (db.ProductImages.Include(img => img.Parent).Any(image => image.Id == productImageData.Id)) return Conflict("Already exists");

			Product? parent = db.Products.Include(product => product.Owner).Where(product => product.Id == (productImageData.Parent)).FirstOrDefault();
			if (parent == null) return NotFound();

			ProductImage prodImage = new ProductImage
			{
				Id = productImageData.Id,
				Parent = parent,
				Url = productImageData.Url
			};

			db.ProductImages.Add(prodImage);
			db.SaveChanges();

			return Ok(new IdReference(prodImage.Id));
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id)
	{
		using (var db = new DatabaseContext())
		{
			ProductImage? prodImage = db.ProductImages.Find(id);
			if (prodImage == null) return NotFound();

			db.ProductImages.Remove(prodImage);
			db.SaveChanges();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Patch(ulong id, [FromBody] JsonPatchDocument<ProductImage> patchdoc)
	{
		using (var db = new DatabaseContext())
		{
			ProductImage? prodImage = db.ProductImages.Find(id);
			if (prodImage == null) return NotFound();

			patchdoc.ApplyTo(prodImage, ModelState);

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(prodImage);
		}
	}
}
