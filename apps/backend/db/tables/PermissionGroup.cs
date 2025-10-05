using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc;

public class PermissionGroup
{
    [Key]
    [Required]
    public required ulong Id { get; set; }

    [Required]
    [ForeignKey(nameof(PermissionHolder))]
    public required PermissionHolder Holder { get; set; }

    [Required]
    public required string DisplayName { get; set; }
}