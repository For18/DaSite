using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MySql.Data.MySqlClient;
using Microsoft.EntityFrameworkCore;

public class DatabaseConnector {
	private readonly int RetryDelayMillis;
	private readonly int MaxRetryCount;

	public DatabaseConnector(int retryDelayMillis, int maxRetryCount) {
		RetryDelayMillis = retryDelayMillis;
		MaxRetryCount = maxRetryCount;
	}
	public async Task<DatabaseContext> Connect(DbContextOptions<DatabaseContext> options) {
		int retryCount = 0;
		while (true) {
			Exception lastException;
			try {
				DatabaseContext db = new DatabaseContext(options);

				RelationalDatabaseCreator databaseCreator = (RelationalDatabaseCreator)db.Database.GetService<IDatabaseCreator>();
				databaseCreator.EnsureCreated();

				return db;
			} catch (MySqlException e) { lastException = e; }

			retryCount++;

			if (retryCount >= MaxRetryCount) throw new Exception("Reached maximum retry count", lastException);

			Console.WriteLine(@"Warning: Failed to connect to database, retrying...");
			if (RetryDelayMillis > 0) Thread.Sleep(RetryDelayMillis);
		}
	}
}