using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class Auction
{
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	public required ushort Count { get; set; }
	[Required]
	public required uint BatchSize { get; set; }

	[Required]
	public required uint StartingPrice { get; set; }

	[Required]
	public required uint MinimumPrice { get; set; }

	[Required]
	public required ulong StartingTime { get; set; }

	[Required]
	[ForeignKey(nameof(Product))]
	[DeleteBehavior(DeleteBehavior.Cascade)]
	public required Product Product { get; set; }

	[ForeignKey(nameof(User))]
	[DeleteBehavior(DeleteBehavior.NoAction)]
	public User? Planner { get; set; }
}