using Microsoft.AspNetCore.Antiforgery;
using System.ComponentModel.DataAnnotations;

namespace TodoApp.Server.Models
{
    public class Todo
    {
        public Guid Id { get; set; }
        [Required, MaxLength(100)]
        public string? Title { get; set; } = string.Empty;
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTimeOffset? DueDate { get; set; }
    }
}
