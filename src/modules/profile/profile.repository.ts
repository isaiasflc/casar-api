import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { AppError } from '../../shared/errors/app-error';
import { ErrorEnum } from '../../shared/errors/app-error.enum';

@Injectable()
export class ProfileRepository {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async findUserById(userId: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id: userId },
            relations: ['followers', 'following'],
        });
    }

    async getFollowersCount(userId: number): Promise<number> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['followers'],
        });
        return user?.followers?.length || 0;
    }

    async getFollowingCount(userId: number): Promise<number> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['following'],
        });
        return user?.following?.length || 0;
    }

    async followUser(currentUserId: number, targetUserId: number): Promise<void> {
        const currentUser = await this.findUserById(currentUserId);
        const targetUser = await this.findUserById(targetUserId);

        if (!currentUser || !targetUser) {
            throw new AppError(ErrorEnum.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        currentUser.following.push(targetUser);
        targetUser.followers.push(currentUser);

        await this.userRepository.save(currentUser);
        await this.userRepository.save(targetUser);
    }

    async unfollowUser(currentUserId: number, targetUserId: number): Promise<void> {
        const currentUser = await this.findUserById(currentUserId);
        const targetUser = await this.findUserById(targetUserId);

        if (!currentUser || !targetUser) {
            throw new AppError(ErrorEnum.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        currentUser.following = currentUser.following.filter((user) => user.id !== targetUserId);
        targetUser.followers = targetUser.followers.filter((user) => user.id !== currentUserId);

        await this.userRepository.save(currentUser);
        await this.userRepository.save(targetUser);
    }

    async isFollowing(currentUserId: number, targetUserId: number): Promise<boolean> {
        const currentUser = await this.findUserById(currentUserId);
        if (!currentUser) {
            throw new AppError(ErrorEnum.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return currentUser.following.some((user) => user.id === targetUserId);
    }
}
