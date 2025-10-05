using System.ComponentModel.DataAnnotations;

public class Product
{
	[Key]
	[Required]
	public required long Id { get; set; }

	[Required]
	[StringLength(50)]
	public required string Name { get; set; }

	public string? Description { get; set; }

	public string? ThumbnailImageUrl { get; set; }

	public required string[] ImageUrls;
}