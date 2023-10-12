import { Request, Response } from 'express';
import MatchService from '../services/match.service'; // Importe a instância da service

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
}
