using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MySql.Data.MySqlClient;

public class DatabaseConnector
{
	private readonly int retryDelayMillis;
	private readonly int maxRetryCount;

	public DatabaseConnector(int retryDelayMillis, int maxRetryCount)
	{
		this.retryDelayMillis = retryDelayMillis;
		this.maxRetryCount = maxRetryCount;
	}
	public async Task<DatabaseContext> Connect()
	{
		int retryCount = 0;
		while (true)
		{
			Exception lastException;
			try
			{
				DatabaseContext db = new DatabaseContext();

				RelationalDatabaseCreator databaseCreator = (RelationalDatabaseCreator)db.Database.GetService<IDatabaseCreator>();
				databaseCreator.EnsureCreated();

				return db;
			}
			catch (MySqlException e) { lastException = e; }

			retryCount++;

			if (retryCount >= maxRetryCount) throw new Exception("Reached maximum retry count", lastException);

			Console.WriteLine(@"Warning: Failed to connect to database, retrying...");
			if (retryDelayMillis > 0) Thread.Sleep(retryDelayMillis);
		}
	}
}