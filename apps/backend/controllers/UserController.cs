using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Infrastructure;

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
	public async Task<ActionResult<PublicUser>> GetPublic(string id) {
		using (var db = new DatabaseContext()) {
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
		return GetPrivate(Convert.ToString(User.FindFirstValue(ClaimTypes.NameIdentifier)!));
	}

	[HttpGet("private/role")]
	[Authorize]
	public async Task<ActionResult<string>> GetUserRole() {
		/* NOTE: fullRole value is 
		 *http://schemas.microsoft.com/ws/2008/06/identity/claims/role: RoleName 
		 * hence the substring I have no idea how to get only the role name
		 */
		string? fullRole = Convert.ToString(User.FindFirst(ClaimTypes.Role));
		string fmtedRole = fullRole!.Substring(fullRole.IndexOf(" ") + 1);

		return new JsonResult(fmtedRole) { StatusCode = 200 };
	}

	[HttpGet("/users/private/batch")]
	[Authorize]
	public async Task<ActionResult<User[]>> BatchGetPrivate([FromBody] string[] ids) {
		if (!(User.IsInRole("Admin") || User.IsInRole("AuctionMaster"))) return Forbid();

		using (var db = new DatabaseContext()) {
			return await db.Users
			  .Where(user => ids.Contains(user.Id))
			  .ToArrayAsync();
		}
	}

	[HttpGet("/users/batch")]
	public async Task<ActionResult<PublicUser[]>> BatchGetPublic([FromRoute] string[] ids) {
		using (var db = new DatabaseContext())
		{
			return await db.Users
				.Where(user => ids.Contains(user.Id))
				.Select(user => new PublicUser {
					Id = user.Id,
					UserName = user.UserName,
					AvatarImageUrl = user.AvatarImageUrl,
					Email = user.Email,
					TelephoneNumber = user.PhoneNumber
				})
			.ToArrayAsync();
		}
	}

	[HttpGet("private/{id}")]
	[Authorize]
	public async Task<ActionResult<User>> GetPrivate(string id) {
		if (!User.IsInRole("Admin") && User.FindFirstValue(ClaimTypes.NameIdentifier) != id) return Forbid();

		using (var db = new DatabaseContext()) {
			User? user = await db.Users.FindAsync(id);
			if (user == null) return NotFound();

			return user;
		}
	}

	[HttpGet("/users/private")]
	[Authorize]
	public async Task<ActionResult<User[]>> GetAllPrivate() {
		if (!User.IsInRole("Admin")) return Forbid();

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

	[HttpPost("/users/batch")]
	[Authorize]
	public async Task<ActionResult> BatchPost([FromBody] User[] users) {
		if (!User.IsInRole("Admin")) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<string>[] failedPosts = [];
			string[] userIds = users.Select(user => user.Id).ToArray();
			string[] existingUserIds = await db.Users
			  .Where(user => userIds.Contains(user.Id))
			  .Select(user => user.Id)
			  .ToArrayAsync();

			foreach (string id in existingUserIds) {
				failedPosts.Append(new FailedBatchEntry<string>(id, "Conflict user already exists"));
			}

			User[] newUsers = users.Where(user => !existingUserIds.Contains(user.Id)).Select(user => user).ToArray();

			foreach (User user in newUsers) {
				db.Users.Add(user);
			}

			await db.SaveChangesAsync();

			string[] newUserIds = newUsers.Select(user => user.Id).ToArray();
			if (failedPosts.Length > 0) return StatusCode(207, new { Posts = newUserIds, FailedPosts = failedPosts });
			return Ok(newUserIds);
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

	[HttpDelete("/users/batch")]
	[Authorize]
	public async Task<ActionResult> BatchDelete([FromBody] string ids) {
		if (!User.IsInRole("Admin")) return Forbid();

		using (var db = new DatabaseContext()) {
			FailedBatchEntry<string>[] failedDeletes = [];
			User[] existingUsers = await db.Users
			  .Where(user => ids.Contains(user.Id))
			  .Select(user => user)
			  .ToArrayAsync();

			string[] existingUserIds = existingUsers.Select(user => user.Id).ToArray();
			foreach (string id in existingUserIds) {
				if (!ids.Contains(id)) {
					failedDeletes.Append(new FailedBatchEntry<string>(id, "User does not exist"));
				}
			}

			foreach (User user in existingUsers) {
				db.Users.Remove(user);
			}

			await db.SaveChangesAsync();

			if (failedDeletes.Length > 0) return StatusCode(207, new { DeletedUsers = existingUserIds, failedDeletes = failedDeletes });
			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult> Update(string id, [FromBody] JsonPatchDocument<User> patchdoc) {
		if (!User.IsInRole("Admin") && User.FindFirstValue(ClaimTypes.NameIdentifier) != id) return Forbid();
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
