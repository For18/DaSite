using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;

[ApiController]
[Route("auction")]
public class AuctionController : ControllerBase
{
  [HttpGet("{id}")]
  public ActionResult<Auction> Get(ulong id)
  {
    using var db = new DatabaseContext();
    {

      Auction? auction = db.Auctions.Find(id);
      if (auction == null) return NotFound();

      return auction;
    }
  }

  [HttpGet("/auctions")]
  public ActionResult<Auction[]> GetAll()
  {
    using (var db = new DatabaseContext())
    {
      Auction[] auctions = db.Auctions.ToArray();

      return auctions;
    }
  }

  [HttpPost]
  public ActionResult Post(Auction auction)
  {
    using (var db = new DatabaseContext())
    {
      if (db.Auctions.Any(auc => auc.Id == auction.Id)) return Conflict("Already exists");

      db.Auctions.Add(auction);
      db.SaveChanges();

      return Ok();
    }
  }

  [HttpDelete("{id}")]
  public  ActionResult Delete(ulong id)
  {
    using (var db = new DatabaseContext())
    {
      Auction? auction = db.Auctions.Find(id);
      if (auction == null) return NotFound();

      db.Auctions.Remove(auction);
      db.SaveChanges();

      return NoContent();
    }
  }

  [HttpPatch("{id}")]
  public  ActionResult Update(ulong id, [FromBody] JsonPatchDocument<Auction> patchdoc)
  {
    using (var db = new DatabaseContext())
    {
      Auction? auction = db.Auctions.Find(id);
      if (auction == null) return NotFound();

      patchdoc.ApplyTo(auction, ModelState);

      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      db.SaveChanges();
      return Ok(auction);
    }
  }
}
