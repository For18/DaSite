using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.ComponentModel.DataAnnotations;

public class PublicUser {
	[StringLength(32)]
	public required string DisplayName { get; set; }

	[StringLength(128)]
	public required string ImageUrl { get; set; }

	[StringLength(254)]
	public required string Email { get; set; }

	public required ulong TelephoneNumber { get; set; }
}

[ApiController]
[Route("user")]
public class UserController : ControllerBase {
	[HttpGet("{id}")]
	public ActionResult<PublicUser> GetPublic(ulong id) {
		using var db = new DatabaseContext();
		{
			User? user = db.Users.Find(id);
			if (user == null) return NotFound();

			return new PublicUser {
				DisplayName = user.DisplayName,
				ImageUrl = user.ImageUrl,
				Email = user.Email,
				TelephoneNumber = user.TelephoneNumber
			};
		}
	}

	[HttpGet("/private-user/{id}")]
	public ActionResult<User> GetPrivate(ulong id) {
		using var db = new DatabaseContext();
		{
			User? user = db.Users.Find(id);
			if (user == null) return NotFound();

			return user;
		}
	}

	[HttpGet("/private-users")]
	public ActionResult<User[]> GetAllPrivate() {
		using (var db = new DatabaseContext()) {
			User[] users = db.Users.ToArray();

			return users;
		}
	}

	[HttpGet("/users")]
	public ActionResult<PublicUser[]> GetAllPublic() {
		using (var db = new DatabaseContext()) {
			User[] users = db.Users.ToArray();

			return users.Select(user => new PublicUser {
				DisplayName = user.DisplayName,
				ImageUrl = user.ImageUrl,
				Email = user.Email,
				TelephoneNumber = user.TelephoneNumber
			}).ToArray();
		}
	}

	[HttpPost]
	public ActionResult Post(User user) {
		using (var db = new DatabaseContext()) {
			if (db.Users.Any(auc => auc.Id == user.Id)) return Conflict("Already exists");

			db.Users.Add(user);
			db.SaveChanges();

			return Ok();
		}
	}

	[HttpDelete("{id}")]
	public ActionResult Delete(ulong id) {
		using (var db = new DatabaseContext()) {
			User? user = db.Users.Find(id);
			if (user == null) return NotFound();

			db.Users.Remove(user);
			db.SaveChanges();

			return NoContent();
		}
	}

	[HttpPatch("{id}")]
	public ActionResult Update(ulong id, [FromBody] JsonPatchDocument<User> patchdoc) {
		using (var db = new DatabaseContext()) {
			User? user = db.Users.Find(id);
			if (user == null) return NotFound();

			patchdoc.ApplyTo(user, ModelState);

			if (!ModelState.IsValid) {
				return BadRequest(ModelState);
			}

			db.SaveChanges();
			return Ok(user);
		}
	}
}
