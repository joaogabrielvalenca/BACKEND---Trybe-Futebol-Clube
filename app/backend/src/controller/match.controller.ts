import { Request, Response } from 'express';
import MatchService from '../services/match.service';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) {}

  public async getAllMatches(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const matches = await this.matchService.getAllMatches();
      return res.json(matches);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public async getFilteredMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress === 'true') {
      const inProgressMatches = await this.matchService.getFilteredMatches(true);
      return res.status(200).json(inProgressMatches);
    } if (inProgress === 'false') {
      const finalizedMatches = await this.matchService.getFilteredMatches(false);
      return res.status(200).json(finalizedMatches);
    }
    return res.status(400).json({ error: 'Parâmetro inProgress deve ser true ou false.' });
  }

  public async finishMatch(req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params;
      const match = await this.matchService.getMatchById(id);
      if (!match) {
        return res.status(404).json({ error: 'Partida não encontrada' });
      }
      if (match.inProgress === true) {
        match.inProgress = false;
        await match.save();
        return res.status(200).json({ message: 'Finished' });
      }
      return res.status(200).json({ message: 'Finished' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao finalizar a partida' });
    }
  }

  public async updateMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;
      const match = await this.matchService.getMatchById(id);
      if (!match) {
        return res.status(404).json({ message: 'Partida não encontrada' });
      }
      if (match.inProgress === false) {
        return res.status(400).json({ message: 'A partida não está em andamento' });
      }
      match.homeTeamGoals = homeTeamGoals;
      match.awayTeamGoals = awayTeamGoals;
      await match.save();
      return res.status(200).json({ message: 'Partida atualizada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar a partida' });
    }
  }

  public async createMatch(req: Request, res: Response): Promise<Response | object> {
    try {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
      const newMatch = await this.matchService.createNewMatch({
        homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals,
      });

      return res.status(201).json({
        id: newMatch.id,
        homeTeamId: newMatch.homeTeamId,
        homeTeamGoals: newMatch.homeTeamGoals,
        awayTeamId: newMatch.awayTeamId,
        awayTeamGoals: newMatch.awayTeamGoals,
        inProgress: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar a partida' });
    }
  }
}
