using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel;
using Microsoft.AspNetCore.Authorization;

[DisplayName(nameof(Product))]
public class ProductExternal {
	public ProductExternal(ulong id, string name, string? description, ulong? thumbnailImageId, string ownerId) {
		Id = id;
		Name = name;
		Description = description;
		ThumbnailImageId = thumbnailImageId;
		OwnerId = ownerId;
	}

	public static ProductExternal ToExternal(Product product) {
		return new ProductExternal(product.Id, product.Name, product.Description, product.ThumbnailImage?.Id, product.Owner.Id);
	}

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
	public string OwnerId { get; init; }
}

[ApiController]
[Route("product")]
public class ProductController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<ProductExternal>> Get(ulong id) {
		using (var db = new DatabaseContext()) {
			Product? product = await db.Products.Include(product => product.Owner).Where(product => product.Id == id).FirstOrDefaultAsync();

			if (product == null) return NotFound();

			return ProductExternal.ToExternal(product);
		}
	}

	[HttpGet("/products")]
	[Authorize]
	public async Task<ActionResult<ProductExternal[]>> GetAll() {
		if (!(User.IsInRole("AuctionMaster") || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			return await db.Products.Include(product => product.Owner).Select(product => ProductExternal.ToExternal(product)).ToArrayAsync();
		}
	}
	[HttpGet("/products/user/{userId}")]
	public async Task<ActionResult<ProductExternal[]>> GetOfUser(string userId) {
		using (var db = new DatabaseContext()) {
			return await db.Products
				.Include(product => product.Owner)
				.Where(product => product.Owner.Id == userId)
				.Select(product => ProductExternal.ToExternal(product))
			.ToArrayAsync();
		}
	}

	[HttpGet("/batch")]
	public async Task<ActionResult<ProductExternal[]>> GetContainedIn([FromQuery] ulong[] ids) {
		using (var db = new DatabaseContext()) {
			return await db.AuctionItems
			  .Include(item => item.Product)
			  .ThenInclude(prod => prod.ThumbnailImage)
			  .Include(item => item.Product)
			  .ThenInclude(prod => prod.Owner)
			  .Where(item => ids.Contains(item.Id))
			  .Select(item => ProductExternal.ToExternal(item.Product))
			  .ToArrayAsync();
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

