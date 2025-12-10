using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class DatabaseContext : IdentityDbContext<User> {
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductImage> ProductImages { get; set; }
	public DbSet<Auction> Auctions { get; set; }
	public DbSet<Sale> Sales { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder) {
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}
}
