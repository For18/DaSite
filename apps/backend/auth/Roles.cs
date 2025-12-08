using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

public static class Roles
{
	public static async Task seed(RoleManager<IdentityRole> roleManager)
	{
		string[] roles = ["Customer", "AuctionMaster", "Admin"];

		await Task.WhenAll(roles.Select(role => Task.Run(async () => {
			if (!await roleManager.RoleExistsAsync(role)) await roleManager.CreateAsync(new IdentityRole(role));
		})).ToArray());
	}
}