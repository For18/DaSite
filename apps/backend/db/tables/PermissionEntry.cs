using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PermissionEntry
{
    [Key]
    [Required]
    public required ulong Key { get; set; }

    [Key]
	[Required]
	[ForeignKey("HolderId")]
	public required PermissionHolder Holder { get; set; }

    [Required]
    public required bool Value { get; set; }
}