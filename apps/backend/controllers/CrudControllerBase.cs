using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

public interface IEntity
{
  ulong Id {get; set;}
}

public class CrudControllerBase<TEntity>: ControllerBase where TEntity: class, IEntity
{
  public virtual ActionResult<TEntity> Get(ulong id)
  {
    using var db = new DatabaseContext();

    TEntity? entity = db.Set<TEntity>().Find(id);
    if (entity == null) return NotFound();

    return entity;
  }

  public virtual ActionResult Post(TEntity entry)
  {
		using (var db = new DatabaseContext())
		{
			if (db.Set<TEntity>().Any(e => e.Id == entry.Id)) return Conflict("Already exists");

			db.Set<TEntity>().Add(entry);
			db.SaveChanges();

			return Ok();
		}
  }

  public virtual ActionResult Delete(ulong id) 
  { 
    using (var db = new DatabaseContext())
    {
      TEntity? entity = db.Set<TEntity>().Find(id);
      if (entity == null) return NotFound();

      db.Set<TEntity>().Remove(entity);
      db.SaveChanges();

      return NoContent();
    }
  }

  public virtual ActionResult Update(ulong id, [FromBody] JsonPatchDocument<TEntity> patchdoc)
  {
    using (var db = new DatabaseContext())
    {
      TEntity? entity = db.Set<TEntity>().Find(id);
      if (entity == null) return NotFound();

      patchdoc.ApplyTo(entity, ModelState);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.SaveChanges();
      return Ok(entity);
    }
  }
}
