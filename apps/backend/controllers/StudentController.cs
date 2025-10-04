using Microsoft.AspNetCore.Mvc;

public class Student
{
	public long Studentnummer { get; set; }
	public string Naam { get; set; }
}

[Route("/student")]
[ApiController]
public class StudentController : ControllerBase
{
	[HttpGet]
	public Student GetStudent()
	{
		return new Student { Studentnummer = 25012345, Naam = "Jelle" };
	}

	[HttpGet("status")]
	public ActionResult<Student> GetStudentWithStatus()
	{
		Student student = new Student { Studentnummer = 25012345, Naam = "Jelle" };

		if (student.Naam == "Jelle")
		{
			return NotFound();
		}

		return student;
	}
}