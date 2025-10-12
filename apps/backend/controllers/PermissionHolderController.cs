using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

[ApiController]
[Route("permission-holder")]
public class PermissionHolderController: ControllerBase
{
	[HttpGet("{id}")]
	public ActionResult<PermissionHolder> Get(ulong id)
	{
    using var db = new DatabaseContext();
    {
      PermissionHolder? permissionHolder = db.PermissionHolders.Find(id);
      if (permissionHolder == null) return NotFound();

      return permissionHolder;
    }
	}

	[HttpGet("/permission-holders")]
	public ActionResult<PermissionHolder[]> GetAll()
	{
    using (var db = new DatabaseContext())
    {
      PermissionHolder[] permissionHolders = db.PermissionHolders.ToArray();

      return permissionHolders;
    }
	}

	[HttpPost]
	public ActionResult Post(PermissionHolder permissionHolder)
	{
		using (var db = new DatabaseContext())
		{
			if (db.PermissionHolders.Any(pholder => pholder.Id == permissionHolder.Id)) return Conflict("Already exists");

			db.PermissionHolders.Add(permissionHolder);
			db.SaveChanges();

			return Ok();
		}
	}

  [HttpDelete("{id}")]
  public ActionResult Delete(ulong id)
  {
    using (var db = new DatabaseContext())
    {
      PermissionHolder? permissionHolder = db.PermissionHolders.Find(id);
      if (permissionHolder == null) return NoContent();

      db.PermissionHolders.Remove(permissionHolder);
      db.SaveChanges();

      return NotFound();
    }
  }

  [HttpPatch("{id}")]
  public ActionResult Update(ulong id, [FromBody] JsonPatchDocument<PermissionHolder> patchdoc)
  {
    using (var db = new DatabaseContext())
    {
      PermissionHolder? permissionHolder = db.PermissionHolders.Find(id);
      if (permissionHolder == null) return NotFound();

      patchdoc.ApplyTo(permissionHolder, ModelState);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.SaveChanges();
      return Ok(permissionHolder);
    }
  }
}
