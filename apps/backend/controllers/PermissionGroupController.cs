using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

[ApiController]
[Route("permission-group")]
public class PermissionGroupController: ControllerBase
{
	[HttpGet("{id}")]
	public ActionResult<PermissionGroup> Get(ulong id)
	{
    using var db = new DatabaseContext();
    {
      PermissionGroup? permissionGroup = db.PermissionGroups.Find(id);
      if (permissionGroup == null) return NotFound();

      return permissionGroup;
    }
	}

	[HttpGet("/permission-groups")]
	public ActionResult<PermissionGroup[]> GetAll()
	{
    using (var db = new DatabaseContext())
    {
      PermissionGroup[] permissionGroups = db.PermissionGroups.ToArray();

      return permissionGroups;
    }
	}

	[HttpPost]
	public ActionResult Post(PermissionGroup permissionGroup)
	{
		using (var db = new DatabaseContext())
		{
			if (db.PermissionGroups.Any(pgroup=> pgroup.Id == permissionGroup.Id)) return Conflict("Already exists");

			db.PermissionGroups.Add(permissionGroup);
			db.SaveChanges();

			return Ok();
		}
	}

  [HttpDelete("{id}")]
  public ActionResult Delete(ulong id)
  {
    using (var db = new DatabaseContext())
    {
      PermissionGroup? permissionGroup = db.PermissionGroups.Find(id);
      if (permissionGroup == null) return NoContent();

      db.PermissionGroups.Remove(permissionGroup);
      db.SaveChanges();

      return NotFound();
    }
  }

  [HttpPatch]
  public ActionResult Update(ulong id, [FromBody] JsonPatchDocument<PermissionGroup> patchdoc)
  {
    using (var db = new DatabaseContext())
    {
      PermissionGroup? permissionGroup = db.PermissionGroups.Find(id);
      if (permissionGroup == null) return NotFound();

      patchdoc.ApplyTo(permissionGroup, ModelState);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.SaveChanges();
      return Ok(permissionGroup);
    }
  }
}
