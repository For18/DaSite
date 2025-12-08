using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

[Index(nameof(Email), IsUnique = true)]
public class User : IdentityUser<ulong> {
	public User() : base() { }

	[Required]
	public double AuctionDebt { get; set; }

	public string? AvatarImageUrl { get; set; }
}