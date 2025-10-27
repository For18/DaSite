using System;
using Microsoft.EntityFrameworkCore;

public class DatabaseContext : DbContext {
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductImage> ProductImages { get; set; }
	public DbSet<User> Users { get; set; }
	public DbSet<Auction> Auctions { get; set; }
	public DbSet<Sale> Sales { get; set; }

	public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) {}

	protected override void OnModelCreating(ModelBuilder modelBuilder) {
		modelBuilder.Entity<User>()
			.HasIndex(user => user.Email).IsUnique();
		modelBuilder.Entity<User>()
			.HasIndex(user => user.TelephoneNumber).IsUnique();
	}
}