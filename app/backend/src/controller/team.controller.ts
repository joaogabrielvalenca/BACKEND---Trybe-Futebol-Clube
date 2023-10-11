import { Request, Response } from 'express';
import TeamService from '../services/team.service';

export default class TeamController {
  // private teamService: TeamService;

  constructor(
    private teamService = new TeamService(),
  ) {}

  public async getAllTeams(_req: Request, res: Response): Promise<Response> {
    const teams = await this.teamService.getAllTeams();
    return res.status(200).json(teams);
  }

  public async getTeamById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const team = await this.teamService.getTeamById(Number(id));

    if (team.message === 'SUCCESSFUL') {
      return res.status(200).json(team.data);
    }

    return res.status(404).json({ error: 'NOT_FOUND' });
  }
}
