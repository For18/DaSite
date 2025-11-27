namespace backend.test;

public class DatabaseTest
{
    [Fact]
    public async void CanConnect()
    {
		Task<DatabaseContext> dbTask = new DatabaseConnector(3, 20).Connect();

		Assert.IsType<DatabaseContext>(await dbTask);
    }
}