import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ProfileService } from '../profile.service';
import { ProfileRepository } from '../profile.repository';
import { AppError } from '../../../shared/errors/app-error';
import { ErrorEnum } from '../../../shared/errors/app-error.enum';

describe('ProfileService', () => {
  let service: ProfileService;
  let repository: ProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: 'ProfileRepository',
          useValue: {
            findUserById: jest.fn(),
            getFollowersCount: jest.fn(),
            getFollowingCount: jest.fn(),
            isFollowing: jest.fn(),
            followUser: jest.fn(),
            unfollowUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    repository = module.get<ProfileRepository>('ProfileRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const userId = 1;
      const currentUserId = 2;
      const user = { id: userId, username: 'testuser', createdAt: new Date(), following: [], followers: [], posts: [] };
      const followersCount = 10;
      const followingCount = 5;
      const isFollowing = true;

      jest.spyOn(repository, 'findUserById').mockResolvedValue(user);
      jest.spyOn(repository, 'getFollowersCount').mockResolvedValue(followersCount);
      jest.spyOn(repository, 'getFollowingCount').mockResolvedValue(followingCount);
      jest.spyOn(repository, 'isFollowing').mockResolvedValue(isFollowing);

      const result = await service.getUserProfile(userId, currentUserId);

      expect(result).toEqual({
        username: user.username,
        createdAt: user.createdAt.toLocaleDateString('pt-BR'),
        followersCount,
        followingCount,
        isFollowing,
      });
    });

    it('should throw an error if user not found', async () => {
      const userId = 1;
      const currentUserId = 2;

      jest.spyOn(repository, 'findUserById').mockResolvedValue(null);

      await expect(service.getUserProfile(userId, currentUserId)).rejects.toThrow(
        new AppError(ErrorEnum.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('followUser', () => {
    it('should follow a user', async () => {
      const currentUserId = 1;
      const targetUserId = 2;

      const followUserSpy = jest.spyOn(repository, 'followUser').mockResolvedValue(undefined);

      const result = await service.followUser(currentUserId, targetUserId);

      expect(followUserSpy).toHaveBeenCalledWith(currentUserId, targetUserId);
      expect(result).toEqual({ message: 'Usuário seguido com sucesso!' });
    });

    it('should throw an error if trying to follow self', async () => {
      const currentUserId = 1;
      const targetUserId = 1;

      await expect(service.followUser(currentUserId, targetUserId)).rejects.toThrow(
        new AppError(ErrorEnum.CANNOT_FOLLOW_SELF, HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user', async () => {
      const currentUserId = 1;
      const targetUserId = 2;

      const unfollowUserSpy = jest.spyOn(repository, 'unfollowUser').mockResolvedValue(undefined);

      const result = await service.unfollowUser(currentUserId, targetUserId);

      expect(unfollowUserSpy).toHaveBeenCalledWith(currentUserId, targetUserId);
      expect(result).toEqual({ message: 'Você deixou de seguir o usuário.' });
    });

    it('should throw an error if trying to unfollow self', async () => {
      const currentUserId = 1;
      const targetUserId = 1;

      await expect(service.unfollowUser(currentUserId, targetUserId)).rejects.toThrow(
        new AppError(ErrorEnum.CANNOT_UNFOLLOW_SELF, HttpStatus.BAD_REQUEST),
      );
    });
  });
});