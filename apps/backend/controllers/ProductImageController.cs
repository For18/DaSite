using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[DisplayName(nameof(ProductImage))]
public class ProductImageExternal {
	public ProductImageExternal(ulong id, ulong parentId, string url) {
		Id = id;
		Parent = parentId;
		Url = url;
	}

	public static ProductImageExternal ToExternal(ProductImage prodImage) {
		return new ProductImageExternal(prodImage.Id, prodImage.Parent.Id, prodImage.Url);
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
	public async Task<ActionResult<ProductImageExternal>> Get(ulong id) {
		using (var db = new DatabaseContext()) {
			ProductImage? prodImage = await db.ProductImages.Include(prod => prod.Parent).Where(image => image.Id == id).FirstOrDefaultAsync();

			if (prodImage == null) return NotFound();

			return ProductImageExternal.ToExternal(prodImage);
		}
	}

	[HttpGet("from/{id}")]
	public async Task<ActionResult<ProductImageExternal[]>> GetByParent(ulong id) {
		using (var db = new DatabaseContext()) {
			return await db.ProductImages.Include(prodImage => prodImage.Parent)
			  .Where(prodImage => prodImage.Parent.Id == id)
			  .Select(prodImage => ProductImageExternal.ToExternal(prodImage)).ToArrayAsync();
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<ActionResult> Post(ProductImageExternal productImageData) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			if (db.ProductImages.Include(img => img.Parent).Any(image => image.Id == productImageData.Id)) return Conflict("Already exists");

			Product? parent = await db.Products.Include(product => product.Owner).Where(product => product.Id == (productImageData.Parent)).FirstOrDefaultAsync();
			if (parent == null) return NotFound();

			ProductImage prodImage = new ProductImage {
				Id = productImageData.Id,
				Parent = parent,
				Url = productImageData.Url
			};

			db.ProductImages.Add(prodImage);
			await db.SaveChangesAsync();

			return Ok(new IdReference<ulong>(prodImage.Id));
		}
	}

	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult> Delete(ulong id) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			ProductImage? prodImage = await db.ProductImages.FindAsync(id);
			if (prodImage == null) return NotFound();

			db.ProductImages.Remove(prodImage);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult> Patch(ulong id, [FromBody] JsonPatchDocument<ProductImage> patchdoc) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			ProductImage? prodImage = await db.ProductImages.FindAsync(id);
			if (prodImage == null) return NotFound();

			patchdoc.ApplyTo(prodImage, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(prodImage);
		}
	}
}
