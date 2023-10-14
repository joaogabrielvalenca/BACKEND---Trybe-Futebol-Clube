import { ModelStatic } from 'sequelize';
import Team from '../database/models/Team';
import Match from '../database/models/Match';

export default class MatchService {
  constructor(
    private matchModel: ModelStatic<Match> = Match,
  ) {}

  async getAllMatches() {
    try {
      const matches = await this.matchModel.findAll({
        include: [
          {
            model: Team,
            as: 'homeTeam',
            attributes: ['teamName'],
          },
          { model: Team,
            as: 'awayTeam',
            attributes: ['teamName'],
          },
        ],
      });

      return matches;
    } catch (error) {
      throw new Error('Erro ao buscar as partidas.');
    }
  }

  async getFilteredMatches(inProgress: boolean | undefined) {
    try {
      const whereCondition = inProgress ? { inProgress: true } : { inProgress: false };

      const matches = await this.matchModel.findAll({
        where: whereCondition,
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'],
          },
          { model: Team, as: 'awayTeam', attributes: ['teamName'],
          },
        ],
      });

      return matches;
    } catch (error) {
      throw new Error('Erro ao buscar as partidas filtradas.');
    }
  }

  async getMatchById(id: string | number) {
    try {
      const match = await this.matchModel.findByPk(id, {
        include: [
          {
            model: Team, as: 'homeTeam', attributes: ['teamName'],
          },
          {
            model: Team, as: 'awayTeam', attributes: ['teamName'],
          },
        ],
      });
      if (!match) {
        throw new Error('Partida não encontrada.');
      }
      return match;
    } catch (error) {
      throw new Error('Erro ao buscar a partida por ID: ');
    }
  }

  async createNewMatch(data: {
    homeTeamId: number;
    awayTeamId: number;
    homeTeamGoals: number;
    awayTeamGoals: number;
  }) {
    try {
      // Crie uma nova partida no banco de dados com os dados fornecidos
      const newMatch = await this.matchModel.create({
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        homeTeamGoals: data.homeTeamGoals,
        awayTeamGoals: data.awayTeamGoals,
        inProgress: true, // A nova partida está em andamento
      });

      // Retorna a partida recém-criada
      return newMatch;
    } catch (error) {
      throw new Error('Erro ao criar uma nova partida');
    }
  }
  // async createNewMatch(data: {
  //   homeTeamId: number, awayTeamId: number, homeTeamGoals:number, awayTeamGoals: number;
  // }) {
  //   try {
  //     if (data.homeTeamId === data.awayTeamId) {
  //       return Promise.reject(
  //         { status: 422, message: 'It is not possible to create a match with two equal teams' });
  //     }
  //     const homeTeam = await this.matchModel.findByPk(data.homeTeamId);
  //     const awayTeam = await this.matchModel.findByPk(data.awayTeamId);

  //     if (!homeTeam || !awayTeam) {
  //       return Promise.reject({ status: 404, message: 'There is no team with such id!' });
  //     }
  //     const newMatch = await this.matchModel.create({
  //       homeTeamId: data.homeTeamId,
  //       awayTeamId: data.awayTeamId,
  //       homeTeamGoals: data.homeTeamGoals,
  //       awayTeamGoals: data.awayTeamGoals,
  //       inProgress: true,
  //     });
  //     return newMatch;
  //   } catch (error) { throw new Error('Erro ao criar uma nova partida'); }
  // }

  async calculateTotalHomePoints(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
      },
    });

    return homeMatches.reduce((totalPoints, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        return totalPoints + 3;
      } if (match.homeTeamGoals === match.awayTeamGoals) {
        return totalPoints + 1;
      }
      return totalPoints;
    }, 0);
  }

  async calculateTotalAwayPoints(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
      },
    });
    return awayMatches.reduce((totalPoints, match) => {
      if (match.awayTeamGoals > match.homeTeamGoals) {
        return totalPoints + 3;
      } if (match.awayTeamGoals === match.homeTeamGoals) {
        return totalPoints + 1;
      }
      return totalPoints;
    }, 0);
  }
}
