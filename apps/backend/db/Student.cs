using System.ComponentModel.DataAnnotations;

public class Student
{
	[Key]
	public long Studentnummer { get; set; }
	[StringLength(30)]
	public required string Naam { get; set; }
}