import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import ServiceResponse from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(
    private teamModel: ModelStatic<Team> = Team,
  ) {}

  public async getAllTeams(): Promise<{ id: number; teamName: string }[]> {
    try {
      const teams = await this.teamModel.findAll();
      // console.log('Dados retornados de getAllTeams:', teams.dataValues);
      const teamsReturn = teams.map((team) => ({
        id: team.id,
        teamName: team.teamName,
      }));
      return teamsReturn;
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      throw error;
    }
  }

  public async getTeamById(id: number):
  Promise<ServiceResponse< { id: number; teamName: string }>> {
    try {
      const team = await this.teamModel.findByPk(id);
      if (!team) {
        return { message: 'Time não encontrado' };
      }
      return {
        message: 'SUCCESSFUL',
        data: {
          id: team.id,
          teamName: team.teamName,
        },
      };
    } catch (error) {
      return { message: `Erro ao buscar o time com ID ${id}` };
    }
  }
}

// export default TeamService;
