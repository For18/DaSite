using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

public class DatabaseContext : IdentityDbContext<User> {
	public DbSet<Product> Products { get; set; }
	public DbSet<ProductImage> ProductImages { get; set; }
	public DbSet<Auction> Auctions { get; set; }
	public DbSet<Sale> Sales { get; set; }

	protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }

	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder) {
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}
}
