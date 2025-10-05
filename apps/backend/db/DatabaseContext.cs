using System;
using Microsoft.EntityFrameworkCore;

public class DatabaseContext : DbContext
{
	public DbSet<Product> Products { get; set; }

	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder)
	{
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}
}