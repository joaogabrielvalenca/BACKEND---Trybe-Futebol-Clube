import { Request, Router, Response, NextFunction } from 'express';
import TeamController from '../controller/team.controller';
import UserController from '../controller/user.controller';
import MatchController from '../controller/match.controller';
import LeaderboardHomeController from '../controller/leaderboard.home.controller';
import LeaderboardAwayController from '../controller/leaderboard.away.controller';
import AuthMiddleware from '../middlewares/auth.middleware';

const teamController = new TeamController();

const userController = new UserController();

const matchController = new MatchController();

const leaderboardHomeController = new LeaderboardHomeController();

const leaderboardAwayController = new LeaderboardAwayController();

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

// router.get('/matches', (req: Request, res: Response) => matchController.getAllMatches(req, res));

router.get('/matches', (req, res) => {
  const { inProgress } = req.query;
  if (inProgress === 'true') {
    req.query.inProgress = 'true'; // Converte o valor para booleano
    return matchController.getFilteredMatches(req, res);
  } if (inProgress === 'false') {
    req.query.inProgress = 'false'; // Converte o valor para booleano
    return matchController.getFilteredMatches(req, res);
  } if (!inProgress) {
    // Se inProgress não estiver definido na query, retorna todas as partidas
    return matchController.getAllMatches(req, res);
  }
  return res.status(400).json({ error: 'Parâmetro inProgress deve ser true ou false.' });
});

router.get('/matches/in-progress', (req, res) => {
  const { inProgress } = req.query;
  console.log('inProgress:', inProgress); // Adicione isso para depuração
  req.query.inProgress = 'true';
  return matchController.getFilteredMatches(req, res);
});

// Rota para buscar partidas finalizadas
router.get('/matches?inProgress=false', (req, res) => {
  req.query.inProgress = 'false';
  return matchController.getFilteredMatches(req, res);
});

router.patch('/matches/:id/finish', validateTokenMiddleware, (req: Request, res: Response) =>
  matchController.finishMatch(req, res));

router.patch('/matches/:id', validateTokenMiddleware, (req: Request, res: Response) =>
  matchController.updateMatch(req, res));

router.post('/matches', validateTokenMiddleware, (req: Request, res: Response) =>
  matchController.createMatch(req, res));

router.get('/leaderboard/home', (req: Request, res: Response) =>
  leaderboardHomeController.getHomeLeaderboard(req, res));

router.get('/leaderboard/away', (req: Request, res: Response) =>
  leaderboardAwayController.getAwayLeaderboard(req, res));

export default router;
