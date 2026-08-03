using MeetSpace.Application.Settings;
using MeetSpace.DataAccess.Configurations;
using MeetSpace.Domain.Models;
using MeetSpace.Domain.Models.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace MeetSpace.DataAccess.Context;

public class MeetSpaceDbContext : DbContext
{
    private readonly IConfiguration _configuration;
    private readonly RolesSettings _rolesSettings;

    public MeetSpaceDbContext(IConfiguration configuration, DbContextOptions<MeetSpaceDbContext> options, IOptions<RolesSettings> rolesSettings) : base(options)
    {
        _configuration = configuration;
        _rolesSettings = rolesSettings.Value;
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString("PostgreSqlConnectionString"));
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(MeetSpaceDbContext).Assembly,
            type => type != typeof(UserConfiguration) && type != typeof(RoleConfiguration)
        );
        modelBuilder.ApplyConfiguration(new UserConfiguration(_rolesSettings));
        modelBuilder.ApplyConfiguration(new RoleConfiguration(_rolesSettings));
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<RoomEquipment> RoomEquipments { get; set; }
    public DbSet<RoomEquipmentMapping> RoomEquipmentMappings { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
}