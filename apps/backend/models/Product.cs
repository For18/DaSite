using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class ProductImage {
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	[ForeignKey("ParentId")]
	public required Product Parent { get; set; }

	[Required]
	public required string Url { get; set; }
}

public class Product {
	[Key]
	[JsonIgnore]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	[StringLength(50)]
	public required string Name { get; set; }

	public string? Description { get; set; }

	[ForeignKey("ThumbnailImageId")]
	public ProductImage? ThumbnailImage { get; set; }
}
