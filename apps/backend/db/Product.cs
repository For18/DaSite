using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductImage
{
	[Key]
	[Required]
	public required long Id { get; set; }

	[Required]
	[ForeignKey(nameof(Product))]
	public required long ProductId { get; set; }

	[Required]
	public required string Url { get; set; }
}

public class Product
{
	[Key]
	[Required]
	public required long Id { get; set; }

	[Required]
	[StringLength(50)]
	public required string Name { get; set; }

	public string? Description { get; set; }

	[ForeignKey(nameof(ProductImage))]
	public long? ThumbnailImageId { get; set; }
}