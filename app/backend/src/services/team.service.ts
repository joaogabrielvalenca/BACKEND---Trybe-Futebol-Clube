import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import ServiceResponse from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(
    private teamModel: ModelStatic<Team> = Team,
  ) {}

  public async getAllTeams(): Promise<ServiceResponse<{ id: number; teamName: string }[]>> {
    console.log('Dados retornados de getAllTeams:');
    try {
      const teams = await this.teamModel.findAll();
      const teamsReturn = teams.map((team) => ({
        id: team.id,
        teamName: team.teamName,
      }));
      return { status: 'SUCCESSFUL', data: teamsReturn };
    } catch (error) {
      console.error('Erro ao buscar times:', error);
      return { status: 'ERROR', message: 'Erro ao buscar times' };
    }
  }

  public async getTeamById(id: number):
  Promise<ServiceResponse< { id: number; teamName: string }>> {
    try {
      const team = await this.teamModel.findByPk(id);
      console.log('Dados retornados de getTeamById:', team);

      if (!team) {
        return { status: 'NOT_FOUND', message: 'Time não encontrado' };
      }
      return {
        status: 'SUCCESSFUL',
        data: {
          id: team.id,
          teamName: team.teamName,
        },
      };
    } catch (error) {
      return { status: 'ERROR', message: `Erro ao buscar o time com ID ${id}` };
    }
  }
}

// export default TeamService;
