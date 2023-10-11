import { Request, Router, Response } from 'express';
import TeamController from '../controller/team.controller';
import UserController from '../controller/user.controller';

const teamController = new TeamController();

const userController = new UserController();

const router = Router();

router.get('/teams', (req: Request, res: Response) => teamController.getAllTeams(req, res));

router.get('/teams/:id', (req: Request, res: Response) => teamController.getTeamById(req, res));

router.post('/login', (req: Request, res: Response) => userController.login(req, res));

export default router;
