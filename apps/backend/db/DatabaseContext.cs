using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

public class DatabaseContext : DbContext {
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductImage> ProductImages { get; set; }
	public DbSet<User> Users { get; set; }
	public DbSet<Auction> Auctions { get; set; }
  public DbSet<AuctionEntry> AuctionEntry { get; set; }
  public DbSet<AuctionItem> AuctionItem { get; set; }
	public DbSet<Sale> Sales { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder) {
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}

  protected override void OnModelCreating(ModelBuilder modelBuilder) {
      modelBuilder.Entity<AuctionEntry>()
          .HasKey(ae => new { ae.AuctionId, ae.AuctionItemId });
  
      modelBuilder.Entity<AuctionEntry>()
          .HasOne(ae => ae.Auction)
          .WithMany()
          .HasForeignKey(ae => ae.AuctionId)
          .OnDelete(DeleteBehavior.Cascade);
  
      modelBuilder.Entity<AuctionEntry>()
          .HasOne(ae => ae.AuctionItem)
          .WithMany()
          .HasForeignKey(ae => ae.AuctionItemId)
          .OnDelete(DeleteBehavior.Cascade);
  }
}
