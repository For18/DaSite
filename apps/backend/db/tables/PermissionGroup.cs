using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PermissionGroup {
	[Key]
	[Required]
	public required ulong Id { get; set; }

	[Required]
	[ForeignKey("HolderId")]
	public required PermissionHolder Holder { get; set; }

	[Required]
	public required string DisplayName { get; set; }
}