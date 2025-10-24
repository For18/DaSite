using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

public class Auction {
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
	public required uint Length { get; set; }

	[Required]
	[ForeignKey("ProductId")]
	[DeleteBehavior(DeleteBehavior.Cascade)]
	public virtual required Product Product { get; set; }

	[ForeignKey("PlannerId")]
	[DeleteBehavior(DeleteBehavior.NoAction)]
	public virtual User? Planner { get; set; }
}