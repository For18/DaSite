using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

[ApiController]
[Route("permission-entry")]
public class PermissionEntryController: ControllerBase
{
	[HttpGet("{key}")]
	public ActionResult<PermissionEntry> Get(ulong key)
	{
    using var db = new DatabaseContext();
    {
      PermissionEntry? permissionEntry = db.PermissionEntries.Find(key);
      if (permissionEntry == null) return NotFound();

      return permissionEntry;
    }
	}

	[HttpGet("/permission-entries")]
	public ActionResult<PermissionEntry[]> GetAll()
	{
    using (var db = new DatabaseContext())
    {
      PermissionEntry[] permissionEntries = db.PermissionEntries.ToArray();

      return permissionEntries;
    }
	}

	[HttpPost]
	public ActionResult Post(PermissionEntry permissionEntry)
	{
		using (var db = new DatabaseContext())
		{
			if (db.PermissionEntries.Any(perm => perm.Key == permissionEntry.Key)) return Conflict("Already exists");

			db.PermissionEntries.Add(permissionEntry);
			db.SaveChanges();

			return Ok();
		}
	}

  [HttpDelete("{key}")]
  public ActionResult Delete(ulong key)
  {
    using (var db = new DatabaseContext())
    {
      PermissionEntry? permissionEntry = db.PermissionEntries.Find(key);
      if (permissionEntry == null) return NoContent();

      db.PermissionEntries.Remove(permissionEntry);
      db.SaveChanges();

      return NotFound();
    }
  }

  [HttpPatch]
  public ActionResult Update(ulong key, [FromBody] JsonPatchDocument<PermissionEntry> patchdoc)
  {
    using (var db = new DatabaseContext())
    {
      PermissionEntry? permissionEntry = db.PermissionEntries.Find(key);
      if (permissionEntry == null) return NotFound();

      patchdoc.ApplyTo(permissionEntry, ModelState);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.SaveChanges();
      return Ok(permissionEntry);
    }
  }
}
