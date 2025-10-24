using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class User {
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	public required double AuctionDebt { get; set; }

	[Required]
	[StringLength(32)]
	public required string DisplayName { get; set; }

	[Required]
	[StringLength(128)]
	public required string ImageUrl { get; set; }

	[Required]
	[StringLength(254)]
	public required string Email { get; set; }

	[Required]
	public required ulong TelephoneNumber { get; set; }
}
