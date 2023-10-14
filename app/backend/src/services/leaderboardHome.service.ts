import { ModelStatic, Sequelize, Op } from 'sequelize';
import Match from '../database/models/Match';

export default class LeaderboardHomeService {
  constructor(
    private matchModel: ModelStatic<Match> = Match,
  ) {}

  async calculateHomePoints(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
      },
    });

    const homePoints = homeMatches.reduce((totalPoints, match) => {
      const isDraw = match.homeTeamGoals === match.awayTeamGoals;
      const isWin = match.homeTeamGoals > match.awayTeamGoals;
      if (isDraw) {
        return totalPoints + 1;
      } if (isWin) {
        return totalPoints + 3;
      }
      return totalPoints; // Losses don't contribute to points
    }, 0);
    return homePoints;
  }

  async calculateTotalHomeGames(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
      },
    });

    return homeMatches.length;
  }

  async calculateTotalHomeDraws(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
        homeTeamGoals: { [Op.eq]: Sequelize.col('away_team_goals') },
      },
    });

    return homeMatches.length;
  }

  async calculateHomeVictories(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
        homeTeamGoals: { [Op.gt]: Sequelize.col('away_team_goals') },
      },
    });
    return homeMatches.length;
  }

  async calculateTotalHomeLosses(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
        homeTeamGoals: { [Op.lt]: Sequelize.col('away_team_goals') },
      },
    });

    return homeMatches.length;
  }

  async calculateHomeGoalsFavor(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
      },
    });

    return homeMatches.reduce((totalGoals, match) => totalGoals + match.homeTeamGoals, 0);
  }

  async calculateHomeGoalsOwn(teamId: number): Promise<number> {
    const homeMatches = await this.matchModel.findAll({
      where: {
        homeTeamId: teamId,
        inProgress: false,
      },
    });

    return homeMatches.reduce((totalGoals, match) => totalGoals + match.awayTeamGoals, 0);
  }
}
