using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

string apiVersionString = "v1";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddRouting();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc(apiVersionString, new OpenApiInfo { Version = apiVersionString });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseRouting();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger(c =>
	{
		c.RouteTemplate = "docs/{documentname}.json";
	});
	app.UseSwaggerUI(c =>
	{
		c.SwaggerEndpoint(apiVersionString + ".json", apiVersionString);
		c.RoutePrefix = "docs";
	});
}

using (var context = new DatabaseContext())
{
	RelationalDatabaseCreator databaseCreator = (RelationalDatabaseCreator)context.Database.GetService<IDatabaseCreator>();
	databaseCreator.EnsureCreated();
}

app.MapGet("/health", () => "Healthy");

app.Run();