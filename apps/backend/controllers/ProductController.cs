using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;

[DisplayName(nameof(Product))]
public class ProductExternal {
	public ProductExternal(ulong id, string name, string? description, ulong? thumbnailImageId, ulong ownerId) {
		Id = id;
		Name = name;
		Description = description;
		ThumbnailImageId = thumbnailImageId;
		OwnerId = ownerId;
	}
	public ProductExternal(Product product)
		: this(product.Id, product.Name, product.Description, product.ThumbnailImage?.Id, product.Owner.Id) { }

	public Product ToProduct(DatabaseContext db) {
		return new Product {
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
public class ProductController : ControllerBase {
	[HttpGet("{id}")]
	public ActionResult<ProductExternal> Get(ulong id) {
		using (var db = new DatabaseContext()) {
			Product? product = db.Products.Where(product => product.Id == id).FirstOrDefault();

			if (product == null) return NotFound();

			return new ProductExternal(product);
		}
	}

	[HttpGet("/products")]
	public ActionResult<ProductExternal[]> GetAll() {
		using (var db = new DatabaseContext()) {
			return db.Products.Select(product => new ProductExternal(product)).ToArray();
		}
	}

	[HttpPost]
	public ActionResult Post(ProductExternal productData) {
		using (var db = new DatabaseContext()) {
			if (db.Products.Any(prod => prod.Id == productData.Id)) return Conflict("Already exists");

			Product product = productData.ToProduct(db);

			db.Products.Add(product);
			db.SaveChanges();

			return Ok(new IdReference(product.Id));
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			Product? product = db.Products.Find(id);
			if (product == null) return NotFound();

			db.Products.Remove(product);
			db.SaveChanges();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Patch(ulong id, [FromBody] JsonPatchDocument<Product> patchdoc) {
		using (var db = new DatabaseContext()) {
			Product? product = db.Products.Find(id);
			if (product == null) return NotFound();

			patchdoc.ApplyTo(product, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(product);
		}
	}
}

[DisplayName(nameof(ProductImage))]
public class ProductImageExternal {
	public ProductImageExternal(ProductImage prodImage) {
		Id = prodImage.Id;
		Parent = prodImage.Parent.Id;
		Url = prodImage.Url;
	}
	public ProductImage ToProductImage(DatabaseContext db) {
		return new ProductImage {
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
public class ProductImageController : ControllerBase {
	[HttpGet("{id}")]
	public ActionResult<ProductImageExternal> Get(ulong id) {
		using (var db = new DatabaseContext()) {
			ProductImage? prodImage = db.ProductImages.Where(image => image.Id == id).FirstOrDefault();

			if (prodImage == null) return NotFound();

			return new ProductImageExternal(prodImage);
		}
	}

	[HttpPost]
	public ActionResult Post(ProductImageExternal productImageData) {
		using (var db = new DatabaseContext()) {
			if (db.ProductImages.Any(image => image.Id == productImageData.Id)) return Conflict("Already exists");

			ProductImage prodImage = productImageData.ToProductImage(db);

			db.ProductImages.Add(prodImage);
			db.SaveChanges();

			return Ok(new IdReference(prodImage.Id));
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			ProductImage? prodImage = db.ProductImages.Find(id);
			if (prodImage == null) return NotFound();

			db.ProductImages.Remove(prodImage);
			db.SaveChanges();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Patch(ulong id, [FromBody] JsonPatchDocument<ProductImage> patchdoc) {
		using (var db = new DatabaseContext()) {
			ProductImage? prodImage = db.ProductImages.Find(id);
			if (prodImage == null) return NotFound();

			patchdoc.ApplyTo(prodImage, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(prodImage);
		}
	}
}
