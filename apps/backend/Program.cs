using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

Task<DatabaseContext> dbTask = new DatabaseConnector(
	Convert.ToInt32(Environment.GetEnvironmentVariable("DB_RETRY_DELAY")),
	Convert.ToInt32(Environment.GetEnvironmentVariable("DB_RETRY_COUNT"))
).Connect();

string apiVersionString = "v1";

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddRouting();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddSwaggerGen(c => {
	c.SwaggerDoc(apiVersionString, new OpenApiInfo { Version = apiVersionString });
	c.SwaggerGeneratorOptions.Servers = new List<OpenApiServer> { new OpenApiServer { Url = Environment.GetEnvironmentVariable("API_SERVER_URL") ?? throw new Exception("Missing API_SERVER_URL environment variable") } };
	c.EnableAnnotations();
});
builder.Services.AddDbContext<DatabaseContext>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>()
	.AddRoles<IdentityRole>()
	.AddEntityFrameworkStores<DatabaseContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapGroup("identity").MapIdentityApi<User>();
app.MapControllers();

using (var scope = app.Services.CreateScope()) {
	await Roles.seed(scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>());
}

if (app.Environment.IsDevelopment()) {
	app.UseSwagger(c => {
		c.RouteTemplate = "docs/{documentname}.json";
	});
	app.UseSwaggerUI(c => {
		c.SwaggerEndpoint(apiVersionString + ".json", apiVersionString);
		c.RoutePrefix = "docs";
	});
}

DatabaseContext db = await dbTask;

app.Run();
