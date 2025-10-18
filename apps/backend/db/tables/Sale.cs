using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

public class Sale
{
    [Key]
    [Required]
    public required ulong Id { get; set; }

    [ForeignKey("PurchaserId")]
	[Required]
	public required User Purchaser { get; set; }

    [ForeignKey("PurchasedAuctionId")]
	[Required]
	public required Auction PurchasedAuction { get; set; }

    [Required]
    public required int Amount { get; set; }

    [Required]
    public required int Price { get; set; }

    [Required]
    public required bool IsPaid { get; set; }
}