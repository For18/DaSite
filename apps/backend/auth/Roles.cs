using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

public static class Roles
{
	public static async Task seed(RoleManager<IdentityRole> roleManager)
	{
		string[] roles = ["Customer", "AuctionMaster", "Admin"];

		foreach (var role in roles) {
			if (!await roleManager.RoleExistsAsync(role)) await roleManager.CreateAsync(new IdentityRole(role));
		}
	}
}