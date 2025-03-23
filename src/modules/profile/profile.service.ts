import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { AppError } from '../../shared/errors/app-error';
import { ErrorEnum } from '../../shared/errors/app-error.enum';

@Injectable()
export class ProfileService {
    constructor(
        @Inject('ProfileRepository')
        private readonly profileRepository: ProfileRepository
    ) { }

    async getUserProfile(userId: number, currentUserId: number): Promise<any> {
        const user = await this.profileRepository.findUserById(userId);
        if (!user) {
            throw new AppError(ErrorEnum.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const followersCount = await this.profileRepository.getFollowersCount(userId);
        const followingCount = await this.profileRepository.getFollowingCount(userId);
        const isFollowing = await this.profileRepository.isFollowing(currentUserId, userId);

        return {
            username: user.username,
            createdAt: user.createdAt.toLocaleDateString('pt-BR'),
            followersCount,
            followingCount,
            isFollowing,
        };
    }

    async followUser(currentUserId: number, targetUserId: number): Promise<Object> {
        if (currentUserId === targetUserId) {
            throw new AppError(ErrorEnum.CANNOT_FOLLOW_SELF, HttpStatus.BAD_REQUEST);
        }

        await this.profileRepository.followUser(currentUserId, targetUserId);
        return {
            message: 'Usuário seguido com sucesso!'
        };
    }

    async unfollowUser(currentUserId: number, targetUserId: number): Promise<object> {
        if (currentUserId === targetUserId) {
            throw new AppError(ErrorEnum.CANNOT_UNFOLLOW_SELF, HttpStatus.BAD_REQUEST);
        }

        await this.profileRepository.unfollowUser(currentUserId, targetUserId);
        return {
            message: 'Você deixou de seguir o usuário.'
        };
    }
}
