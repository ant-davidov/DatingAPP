using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using API.Hellpers;

namespace API.Controllers
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        
        public LikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            
        }
        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var likedUseer = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var SourceUser = await _unitOfWork.LikesRepository.GetUserWithLikes(sourceUserId);

            if(likedUseer == null) return NotFound();

            if(SourceUser.UserName == username) return BadRequest("Ошибка");

            var userLike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedUseer.Id);
            if(userLike != null) return BadRequest("Вы уже лайкнули этого пользователя");

            userLike = new UserLike 
            {
                SourceUserId= sourceUserId,
                LikedUserId = likedUseer.Id
            };
            SourceUser.LikedUsers.Add(userLike);
            if( await _unitOfWork.Complete()) return Ok();
            return BadRequest("Ошибка выполнения");

        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDto>>> GetUserLikes ([FromQuery]LikeParams likeParams)
        {
            likeParams.UserId = User.GetUserId();
            var users = await _unitOfWork.LikesRepository.GetUserLikes(likeParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }

    }
}