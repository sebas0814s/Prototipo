import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { AuthenticatedRequest } from '../../shared/types';
import { successResponse, errorResponse } from '../../shared/utils';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await this.userService.register(req.body);
      res.status(201).json(successResponse({ user: user.toPublicJSON(), token }, 'Account created'));
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user, token } = await this.userService.login(req.body);
      res.json(successResponse({ user: user.toPublicJSON(), token }));
    } catch (err) {
      next(err);
    }
  };

  public getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.findById(req.user!.userId);
      if (!user) {
        res.status(404).json(errorResponse('User not found'));
        return;
      }
      res.json(successResponse(user.toPublicJSON()));
    } catch (err) {
      next(err);
    }
  };

  public updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.updateProfile(req.user!.userId, req.body);
      res.json(successResponse(user.toPublicJSON(), 'Profile updated'));
    } catch (err) {
      next(err);
    }
  };
}
