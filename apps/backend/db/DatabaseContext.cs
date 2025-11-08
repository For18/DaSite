using System;
using Microsoft.EntityFrameworkCore;

public class DatabaseContext : DbContext {
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductImage> ProductImages { get; set; }
	public DbSet<User> Users { get; set; }
	public DbSet<Auction> Auctions { get; set; }
	public DbSet<Sale> Sales { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder) {
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}
}
