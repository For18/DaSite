using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AuctionItem {
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
	[ForeignKey("ProductId")]
	public required Product Product { get; set; }

	[Required]
	public required User Owner { get; set; }

	[Required]
	public required uint Length { get; set; }
}

public class AuctionEntry {
	[Required]
	[ForeignKey("AuctionId")]
	public required Auction Auction { get; set; }

	[Required]
	[ForeignKey("AuctionItemId")]
	public required AuctionItem AuctionItem { get; set; }
}

public class Auction {
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[ForeignKey("PlannerId")]
	public virtual User? Planner { get; set; }

	[Required]
	public required ulong StartingTime { get; set; }

}
