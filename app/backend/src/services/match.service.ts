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
}
