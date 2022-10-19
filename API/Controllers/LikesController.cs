using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public LikesController(IUnitOfWork unitOfWork)
        {
            this._unitOfWork = unitOfWork;
            
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await this._unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await this._unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);
            if (likedUser == null)
                return NotFound();
            if (sourceUser.UserName == username)
                return BadRequest("you can not like your self");
            var userLike = await this._unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);
            if (userLike != null)
                return BadRequest("you already like this user");
            userLike = new UserLike { SourceUserId = sourceUserId, LikedUserId = likedUser.Id };
            sourceUser.LikedUsers.Add(userLike);
            if (await this._unitOfWork.Complete())
            {
                return Ok();
            }
            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes(
            [FromQuery] LikesParams likesParams
        )
        {
            likesParams.UserId = User.GetUserId();
            var users = await this._unitOfWork.LikesRepository.GetUserLikes(likesParams);
            Response.AddPaginationHeader(
                users.CurrentPage,
                users.PageSize,
                users.TotalCount,
                users.TotalPages
            );
            return Ok(users);
        }
    }
}
