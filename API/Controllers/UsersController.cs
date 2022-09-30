using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            this._mapper = mapper;
            this._userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await this._userRepository.GetMembersAsync();

            return Ok(users);
        }

        // [HttpGet("username")] //query argument
        [HttpGet("{username}")]  //url path
        public async Task<ActionResult<MemberDto>> GetUsers(string username)
        {
            return await this._userRepository.GetMemberAsync(username);
        }
        [HttpPut]
        public async Task<ActionResult>UpdateUser(MemberUpdateDto memberUpdateDto){
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user=await this._userRepository.GetUserByUsernameAsync(username);
            this._mapper.Map(memberUpdateDto,user);
            this._userRepository.Update(user);
            if(await this._userRepository.SaveAllAsync())return NoContent();
            return BadRequest("Failed to update user");
        }
    }
}
