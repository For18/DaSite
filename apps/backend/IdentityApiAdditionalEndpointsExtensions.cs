namespace Microsoft.AspNetCore.Identity;
using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

public static class IdentityApiAdditionalEndpointsExtensions
{
    public static IEndpointRouteBuilder MapIdentityApiAdditionalEndpoints<TUser>(this IEndpointRouteBuilder endpoints)
            where TUser : class, new()
    {
        ArgumentNullException.ThrowIfNull(endpoints);

        var routeGroup = endpoints.MapGroup("");

        var accountGroup = routeGroup.MapGroup("/account").RequireAuthorization();

        accountGroup.MapPost("/logout", async (SignInManager<TUser> signInManager) =>
        {
            await signInManager.SignOutAsync();
            return "200 Ok"; 
        });

        return endpoints;
    }
}
