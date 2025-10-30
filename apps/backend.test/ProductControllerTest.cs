using Microsoft.EntityFrameworkCore;

public class ProductControllerTest {
	private readonly DatabaseConnector connector = new DatabaseConnector(0, int.MaxValue);

	[Fact]
	public async void ShouldBeAbleToPost() {
		using var db = await connector.Connect(new DbContextOptionsBuilder<DatabaseContext>()
			.UseInMemoryDatabase(databaseName: "for18-test")
		.Options);


	}
}