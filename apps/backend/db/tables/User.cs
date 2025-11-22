using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Email), IsUnique = true)]
[Index(nameof(TelephoneNumber), IsUnique = true)]
public class User : IdentityUser<ulong> {
	public User() : base() {}

	[Required]
	public double AuctionDebt { get; set; }

	[Required]
	public string ImageUrl { get; set; }

	[Required]
	public ulong TelephoneNumber { get; set; }
}