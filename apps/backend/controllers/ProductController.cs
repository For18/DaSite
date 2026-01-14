using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[DisplayName(nameof(Product))]
public class ProductExternal {
	public ProductExternal(ulong id, string name, string? description, ulong? thumbnailImageId) {
		Id = id;
		Name = name;
		Description = description;
		ThumbnailImageId = thumbnailImageId;
	}

	public static ProductExternal ToExternal(Product product) {
		return new ProductExternal(product.Id, product.Name, product.Description, product.ThumbnailImage?.Id);
	}

	public Product ToProduct(DatabaseContext db) {
		return new Product {
			Id = Id,
			Name = Name,
			Description = Description,
			ThumbnailImage = db.ProductImages.Where(i => i.Id == ThumbnailImageId).FirstOrDefault(),
		};
	}
	public ulong Id { get; init; }
	public string Name { get; init; }
	public string? Description { get; init; }
	public ulong? ThumbnailImageId { get; init; }
}

[ApiController]
[Route("product")]
public class ProductController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<ProductExternal>> Get(ulong id) {
		using (var db = new DatabaseContext()) {
			Product? product = await db.Products.Include(product => product.ThumbnailImage).Where(product => product.Id == id).FirstOrDefaultAsync();

			if (product == null) return NotFound();

			return ProductExternal.ToExternal(product);
		}
	}

	[HttpGet("/products/batch")]
	public async Task<ActionResult<ProductExternal[]>> BatchGet([FromQuery] ulong[] ids) {
		using (var db = new DatabaseContext()) {
			return await db.Products
				.Include(product => product.ThumbnailImage)
				.Where(product => ids.Contains(product.Id))
				.Select(product => ProductExternal.ToExternal(product))
				.ToArrayAsync();
		}
	}

	[HttpGet("/products")]
	[Authorize]
	public async Task<ActionResult<ProductExternal[]>> GetAll() {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			return await db.Products.Select(product => ProductExternal.ToExternal(product)).ToArrayAsync();
		}
	}
	[HttpGet("/products/user/{userId}")]
	public async Task<ActionResult<ProductExternal[]>> GetOfUser(string userId) {
		using (var db = new DatabaseContext()) {
			var products = await db.AuctionItems
				.Where(item => item.Owner.Id == userId)
				.Select(item => new ProductExternal(
			  item.Product.Id,
			  item.Product.Name,
			  item.Product.Description,
			  item.Product.ThumbnailImage != null ? item.Product.ThumbnailImage.Id : null
		))
			.ToArrayAsync();

			return Ok(products);
		}
	}

	[HttpPost("/products/batch")]
	[Authorize]
	public async Task<ActionResult> BatchPost(ProductExternal[] productsData) {
		using (var db = new DatabaseContext()) {
			FailedBatchEntry<ProductExternal>[] failedPost = [];

			Product[] products = productsData.Select(product => product.ToProduct(db)).ToArray();

			ulong[] productIds = productsData.Select(product => product.Id).ToArray();
			ProductExternal[] existingProducts = await db.Products
				.Where(product => productIds.Contains(product.Id))
				.Select(product => ProductExternal.ToExternal(product))
				.ToArrayAsync();

			IdReference<ulong>[] newProducts = [];

			foreach (ProductExternal entry in productsData) {
				if (existingProducts.Contains(entry)) {
					failedPost.Append(new FailedBatchEntry<ProductExternal>(entry, "Conflict, product already exists"));
				} else {
					db.Add(entry);
					newProducts.Append(new IdReference<ulong>(entry.Id));
				}
			}

			await db.SaveChangesAsync();

			if (failedPost.Length > 0) {
				return StatusCode(207, new {
					AddedProducts = newProducts,
					FailedProducts = failedPost
				});
			}

			return Ok(newProducts);
		}
	}

	[HttpPost]
	[Authorize]
	public async Task<ActionResult> Post(ProductExternal productData) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			if (await db.Products.AnyAsync(prod => prod.Id == productData.Id)) return Conflict("Already exists");

			Product product = productData.ToProduct(db);

			db.Products.Add(product);
			await db.SaveChangesAsync();

			return Ok(new IdReference<ulong>(product.Id));
		}
	}

	[HttpDelete("/products/batch")]
	[Authorize]
	public async Task<ActionResult> BatchDelete([FromBody] ulong[] ids) {
		bool isAdmin = User.IsInRole("Admin");
		string? currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<ulong>[] failedProducts = [];

			Product[] products = await db.Products
		.Where(product => ids.Contains(product.Id))
		.Select(product => product).ToArrayAsync();

			foreach (ulong productId in ids) {
				Product? product = products.FirstOrDefault(p => p.Id == productId);
				if (product == null) {
					failedProducts.Append(new FailedBatchEntry<ulong>(productId, "Corresponding Product does not exist"));
				} else if (isAdmin) {
					db.Products.Remove(product);
				} else {
					failedProducts.Append(new FailedBatchEntry<ulong>(productId, "Unauthorized deletion attempt"));
				}
			}

			await db.SaveChangesAsync();
			if (failedProducts.Length > 0) {
				return StatusCode(207, new { FailedDeletes = failedProducts });
			}

			return NoContent();
		}
	}


	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult> Delete(ulong id) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			Product? product = await db.Products.FindAsync(id);
			if (product == null) return NotFound();

			db.Products.Remove(product);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult> Patch(ulong id, [FromBody] JsonPatchDocument<Product> patchdoc) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			Product? product = await db.Products.FindAsync(id);
			if (product == null) return NotFound();

			patchdoc.ApplyTo(product, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(product);
		}
	}
}

