import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getUserProfile: jest.fn(),
            followUser: jest.fn(),
            unfollowUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 1;
      const currentUserId = 2;
      const userProfile = {
        username: 'testuser',
        createdAt: '2025-03-22',
        followersCount: 10,
        followingCount: 5,
        isFollowing: true,
      };

      jest.spyOn(service, 'getUserProfile').mockResolvedValue(userProfile);

      const result = await controller.getProfile(userId, currentUserId);

      expect(result).toEqual(userProfile);
      expect(service.getUserProfile).toHaveBeenCalledWith(userId, currentUserId);
    });
  });

  describe('followUser', () => {
    it('should follow a user', async () => {
      const userId = 1;
      const targetUserId = 2;
      const followResponse = { message: 'Usuário seguido com sucesso!' };

      jest.spyOn(service, 'followUser').mockResolvedValue(followResponse);

      const result = await controller.followUser(userId, targetUserId);

      expect(result).toEqual(followResponse);
      expect(service.followUser).toHaveBeenCalledWith(userId, targetUserId);
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user', async () => {
      const userId = 1;
      const targetUserId = 2;
      const unfollowResponse = { message: 'Você deixou de seguir o usuário.' };

      jest.spyOn(service, 'unfollowUser').mockResolvedValue(unfollowResponse);

      const result = await controller.unfollowUser(userId, targetUserId);

      expect(result).toEqual(unfollowResponse);
      expect(service.unfollowUser).toHaveBeenCalledWith(userId, targetUserId);
    });
  });
});