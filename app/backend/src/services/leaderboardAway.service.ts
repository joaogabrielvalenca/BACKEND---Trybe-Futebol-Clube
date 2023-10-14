import { ModelStatic, Sequelize, Op } from 'sequelize';
import Match from '../database/models/Match';

export default class LeaderboardAwayService {
  constructor(
    private matchModel: ModelStatic<Match> = Match,
  ) {}

  async calculateAwayPoints(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
      },
    });

    const awayPoints = awayMatches.reduce((totalPoints, match) => {
      const isDraw = match.awayTeamGoals === match.homeTeamGoals;
      const isWin = match.awayTeamGoals > match.homeTeamGoals;
      if (isDraw) {
        return totalPoints + 1;
      } if (isWin) {
        return totalPoints + 3;
      }
      return totalPoints; // Losses don't contribute to points
    }, 0);
    return awayPoints;
  }

  async calculateTotalAwayGames(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
      },
    });

    return awayMatches.length;
  }

  async calculateTotalAwayDraws(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
        awayTeamGoals: { [Op.eq]: Sequelize.col('home_team_goals') },
      },
    });

    return awayMatches.length;
  }

  async calculateAwayVictories(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
        awayTeamGoals: { [Op.gt]: Sequelize.col('home_team_goals') },
      },
    });
    return awayMatches.length;
  }

  async calculateTotalAwayLosses(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
        awayTeamGoals: { [Op.lt]: Sequelize.col('home_team_goals') },
      },
    });

    return awayMatches.length;
  }

  async calculateAwayGoalsFavor(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
      },
    });

    return awayMatches.reduce((totalGoals, match) => totalGoals + match.awayTeamGoals, 0);
  }

  async calculateAwayGoalsOwn(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
      },
    });

    return awayMatches.reduce((totalGoals, match) => totalGoals + match.homeTeamGoals, 0);
  }
}
