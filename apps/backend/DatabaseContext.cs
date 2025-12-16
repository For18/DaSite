using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

public class DatabaseContext : IdentityDbContext<User> {
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductImage> ProductImages { get; set; }
	public DbSet<Auction> Auctions { get; set; }
	public DbSet<AuctionEntry> AuctionEntries { get; set; }
	public DbSet<AuctionItem> AuctionItems { get; set; }
	public DbSet<Sale> Sales { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder) {
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder) {
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<AuctionEntry>()
		  .HasOne(ae => ae.Auction)
		  .WithMany()
		  .HasForeignKey("AuctionId")
		  .OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<AuctionEntry>()
		  .HasOne(ae => ae.AuctionItem)
		  .WithMany()
		  .HasForeignKey("AuctionItemId")
		  .OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<AuctionItem>()
		  .HasOne(ai => ai.Product)
		  .WithMany()
		  .HasForeignKey("ProductId")
		  .OnDelete(DeleteBehavior.Cascade);

		modelBuilder.Entity<AuctionEntry>()
		  .HasKey("AuctionId", "AuctionItemId");
	}
}
