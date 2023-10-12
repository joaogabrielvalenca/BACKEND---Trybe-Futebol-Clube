import { Request, Router, Response, NextFunction } from 'express';
import TeamController from '../controller/team.controller';
import UserController from '../controller/user.controller';
import MatchController from '../controller/match.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const teamController = new TeamController();

const userController = new UserController();

const matchController = new MatchController();

const authMiddleware = new AuthMiddleware();

const validateTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  authMiddleware.validateToken(req, res, next);
};

const router = Router();

router.get('/teams', (req: Request, res: Response) => teamController.getAllTeams(req, res));

router.get('/teams/:id', (req: Request, res: Response) => teamController.getTeamById(req, res));

router.post('/login', (req: Request, res: Response) => userController.login(req, res));

router.get(
  '/login/role',
  validateTokenMiddleware,
  (req: Request, res: Response) => userController.role(req, res),
);

router.get('/matches', (req: Request, res: Response) => matchController.getAllMatches(req, res));

export default router;
