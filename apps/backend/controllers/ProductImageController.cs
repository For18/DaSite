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

	[HttpGet("/product-images/batch")]
	public async Task<ActionResult<ProductImageExternal[]>> BatchGet([FromBody] ulong[] ids)
	{
		using (var db = new DatabaseContext())
		{
			return await db.ProductImages
			.Include(prodImage => prodImage.Parent)
			.Where(prodImage => ids.Contains(prodImage.Id))
			.Select(prodImage => ProductImageExternal.ToExternal(prodImage))
			.ToArrayAsync();
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

	[HttpPost("/product-images/batch")]
	public async Task<ActionResult> BatchPost([FromBody] ProductImageExternal[] images) {
		using (var db = new DatabaseContext()) {
			FailedBatchEntry<ProductImageExternal>[] failedPosts = [];

			ulong[] imageIds = images.Select(image => image.Id).ToArray();
			ProductImageExternal[] existingImages = await db.ProductImages
			  .Where(image => imageIds.Contains(image.Id))
			  .Select(image => ProductImageExternal.ToExternal(image))
			  .ToArrayAsync();
			foreach (ProductImageExternal image in existingImages) {
				failedPosts.Append(new FailedBatchEntry<ProductImageExternal>(image, "Conflict image already exists"));
			}

			ProductImageExternal[] newImages = images
			  .Where(image => !existingImages.Contains(image))
			  .ToArray();

			ulong[] newImageIds = images.Select(image => image.Id).ToArray();
			Product[] parents = await db.Products
			  .Where(product => newImageIds.Contains(product.Id))
			  .ToArrayAsync();


			foreach (ProductImageExternal image in newImages) {
				Product parent = parents.Where(prod => prod.Id == image.Parent).First();
				if (parent == null) {
					failedPosts.Append(new FailedBatchEntry<ProductImageExternal>(image, "Invalid parent"));
					continue;
				}

				ProductImage prodImage = new ProductImage {
					Id = image.Id,
					Parent = parent,
					Url = image.Url
				};
				db.ProductImages.Add(prodImage);
			}

			await db.SaveChangesAsync();

			return Ok(new {
				AddedImages = newImageIds.Select(id => new IdReference<ulong>(id)).ToArray(),
				FailedImages = failedPosts
			});
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

	[HttpDelete("batch")]
	public async Task<ActionResult> BatchDelete([FromBody] ulong[] ids){
		using (var db = new DatabaseContext()) {
			FailedBatchEntry<ulong>[] failedProductImages = [];
		
			ProductImage[] productImages = await db.ProductImages.Where(prodImages => ids.Contains(prodImages.Id)).ToArrayAsync();

			foreach (var productImageId in ids)
			{
				ProductImage? prodImage = productImages.FirstOrDefault(pi => productImageId == pi.Id);
				if (prodImage == null)
				{
					failedProductImages.Append(new FailedBatchEntry<ulong>(productImageId, "Corresponding Product does not exist"));
				} else
				{
					db.ProductImages.Remove(prodImage);
				}
			}

			await db.SaveChangesAsync();

			if (failedProductImages.Length > 0)
			{
				return StatusCode(207, new {FailedDeletes = failedProductImages});
			}
			
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
