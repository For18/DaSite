using System;
using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

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
  public required Product Product { get; set; }

  [Required]
  public required uint Length { get; set; }
}

// TODO: add restrict element thingy so planned in products cannot get deleted
public class AuctionEntry {
  [Key, Column(Order = 0)]
  [Required]
  [ForeignKey("AuctionId")]
  [DeleteBehavior(DeleteBehavior.NoAction)]
  public required Auction Auction { get; set; }

  [Key, Column(Order = 1)]
  [Required]
  [ForeignKey("AuctionItemId")]
  [DeleteBehavior(DeleteBehavior.NoAction)]
  public required AuctionItem AuctionItem { get; set; }

} 

public class Auction {
  [Key]
  [Required]
  public required ulong Id { get; set; }

  [ForeignKey("PlannerId")]
  [DeleteBehavior(DeleteBehavior.NoAction)]
  public virtual User? Planner { get; set; }

  public ulong? StartingTime { get; set; }

}
