import { Controller, Get, Param, Query, Patch, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get(':userId')
    async getProfile(
        @Param('userId') userId: number,
        @Query('currentUserId') currentUserId: number,
    ) {
        return this.profileService.getUserProfile(userId, currentUserId);
    }

    @Patch(':userId/follow')
    async followUser(
        @Param('userId') userId: number,
        @Query('targetUserId') targetUserId: number,
    ) {
        return this.profileService.followUser(userId, targetUserId);
    }

    @Patch(':userId/unfollow')
    async unfollowUser(
        @Param('userId') userId: number,
        @Query('targetUserId') targetUserId: number,
    ) {
        return this.profileService.unfollowUser(userId, targetUserId);
    }
}
