using System;
using Microsoft.EntityFrameworkCore;

public class DatabaseContext : DbContext
{
	protected override void OnConfiguring(DbContextOptionsBuilder contextBuilder)
	{
		contextBuilder.UseMySQL(Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING") ?? "");
	}
}