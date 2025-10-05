using System.Threading.Tasks;
using Auth0.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("/user")]
public class UserController : ControllerBase
{
	[HttpGet("login")]
	public async Task Login(string returnUrl = "/")
	{
		var authenticationProperties = new LoginAuthenticationPropertiesBuilder()
			.WithRedirectUri("./")
		.Build();

		await HttpContext.ChallengeAsync(Auth0Constants.AuthenticationScheme, authenticationProperties);
	}

	[HttpGet("logout")]
	[Authorize]
	public async Task Logout()
	{
		var authenticationProperties = new LoginAuthenticationPropertiesBuilder()
			.WithRedirectUri("/")
		.Build();

		await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, HttpContext.User);
		await HttpContext.SignOutAsync(Auth0Constants.AuthenticationScheme, authenticationProperties);
	}
}