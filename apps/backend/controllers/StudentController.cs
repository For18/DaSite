using System.Linq;
using Microsoft.AspNetCore.Mvc;

[Route("/student")]
[ApiController]
public class StudentController : ControllerBase
{
	[HttpGet("{nr}")]
	public ActionResult<Student> GetStudent(long nr)
	{
		using (var db = new DatabaseContext())
		{
			Student? student = db.Students.Where(s => s.Studentnummer == nr).FirstOrDefault();

			if (student == null) return NotFound();

			return student;
		}
	}

	[HttpPost]
	public ActionResult PostStudent(Student student)
	{
		using (var db = new DatabaseContext())
		{
			db.Students.Add(student);
			db.SaveChanges();

			return Ok();
		}
	}
}