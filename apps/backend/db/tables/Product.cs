using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductImage
{
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	[ForeignKey(nameof(Product))]
	public required ulong Parent { get; set; }

	[Required]
	public required string Url { get; set; }
}

public class Product
{
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	[StringLength(50)]
	public required string Name { get; set; }

	public string? Description { get; set; }

	[ForeignKey(nameof(ProductImage))]
	public ProductImage? ThumbnailImage { get; set; }

	[Required]
	public required ulong Owner { get; set; }
}
