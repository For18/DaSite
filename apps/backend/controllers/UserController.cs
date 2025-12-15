using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

public class PublicUser {
	public required string Id { get; set; }

	[StringLength(32)]
	public required string? UserName { get; set; }

	public required string? AvatarImageUrl { get; set; }

	[StringLength(254)]
	public required string? Email { get; set; }

	public required string? TelephoneNumber { get; set; }
}

[ApiController]
[Route("user")]
public class UserController : ControllerBase {
	[HttpGet("{id}")]
	public async Task<ActionResult<PublicUser>> GetPublic(ulong id) {
		using (var db = new DatabaseContext())
		{
			User? user = await db.Users.FindAsync(id);
			if (user == null) return NotFound();

			return new PublicUser {
				Id = user.Id,
				UserName = user.UserName,
				AvatarImageUrl = user.AvatarImageUrl,
				Email = user.Email,
				TelephoneNumber = user.PhoneNumber
			};
		}
	}

	[HttpGet("/private/current")]
	[Authorize]
	public Task<ActionResult<User>> GetCurrent() {
		return GetPrivate(Convert.ToUInt64(User.FindFirstValue(ClaimTypes.NameIdentifier)));
	}

	[HttpGet("private/{id}")]
	public async Task<ActionResult<User>> GetPrivate(ulong id) {
		using (var db = new DatabaseContext())
		{
			User? user = await db.Users.FindAsync(id);
			if (user == null) return NotFound();

			return user;
		}
	}

	[HttpGet("users/private")]
	public async Task<ActionResult<User[]>> GetAllPrivate() {
		using (var db = new DatabaseContext()) {
			User[] users = await db.Users.ToArrayAsync();

			return users;
		}
	}

	[HttpGet("/users")]
	public async Task<ActionResult<PublicUser[]>> GetAllPublic() {
		using (var db = new DatabaseContext()) {
			return await db.Users.Select(user => new PublicUser {
				Id = user.Id,
				UserName = user.UserName,
				AvatarImageUrl = user.AvatarImageUrl,
				Email = user.Email,
				TelephoneNumber = user.PhoneNumber
			}).ToArrayAsync();
		}
	}

	[HttpGet("/users/by-name/{name}")]
	public async Task<ActionResult<User[]>> GetAllByName(string name) {
		using (var db = new DatabaseContext()) {
			return await db.Users.Where(user => user.UserName != null && EF.Functions.Like(user.UserName.ToLower(), $"%{name.ToLower()}%")).ToArrayAsync();
		}
	}

	[HttpPost]
	public async Task<ActionResult> Post(User user) {
		using (var db = new DatabaseContext()) {
			if (await db.Users.AnyAsync(auc => auc.Id == user.Id)) return Conflict("Already exists");

			db.Users.Add(user);
			await db.SaveChangesAsync();

			return Ok(new IdReference<string>(user.Id));
		}
	}

	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult> Delete(string id) {
		if (!(User.FindFirstValue(ClaimTypes.NameIdentifier) == id || User.IsInRole("Admin"))) return Forbid();

		using (var db = new DatabaseContext()) {
			User? user = await db.Users.FindAsync(id);
			if (user == null) return NotFound();

			db.Users.Remove(user);
			await db.SaveChangesAsync();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public async Task<ActionResult> Update(ulong id, [FromBody] JsonPatchDocument<User> patchdoc) {
		using (var db = new DatabaseContext()) {
			User? user = await db.Users.FindAsync(id);
			if (user == null) return NotFound();

			patchdoc.ApplyTo(user, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			await db.SaveChangesAsync();
			return Ok(user);
		}
	}
}
