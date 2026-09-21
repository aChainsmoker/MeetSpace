using MeetSpace.Domain.Abstractions.Services;
using MeetSpace.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeetSpace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;

    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
    }
    
    [HttpGet]
    public async Task<ActionResult<RoomEquipment>> GetEquipment(CancellationToken cancellationToken = default)
    {
        return Ok(await _equipmentService.GetEquipmentListAsync(cancellationToken));
    }
}