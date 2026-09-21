namespace MeetSpace.DataAccess.Seeding;

public class SeedingOptions
{
    public List<RoomSeedConfig> Rooms { get; set; } = [];
    public List<EquipmentSeedConfig> Equipment { get; set; } = [];
    public List<MappingSeedConfig> Mappings { get; set; } = [];
}

public class RoomSeedConfig
{
    public string Name { get; set; } = null!;
    public uint Capacity { get; set; }
    public int Floor { get; set; }
    public string? Description { get; set; }
}

public class EquipmentSeedConfig
{
    public string Name { get; set; } = null!;
}

public class MappingSeedConfig
{
    public string RoomName { get; set; } = null!;
    public string EquipmentName { get; set; } = null!;
}