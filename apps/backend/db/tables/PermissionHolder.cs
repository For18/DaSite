using System.ComponentModel.DataAnnotations;

public class PermissionHolder
{
    [Key]
    [Required]
    public required ulong Id { get; set; }
}