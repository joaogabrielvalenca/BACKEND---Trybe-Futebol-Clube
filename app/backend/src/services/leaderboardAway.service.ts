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

  async calculateAwayGoalsBalance(teamId: number): Promise<number> {
    const awayMatches = await this.matchModel.findAll({
      where: {
        awayTeamId: teamId,
        inProgress: false,
      },
    });

    const goalsFavor = awayMatches.reduce((totalGoals, match) =>
      totalGoals + match.awayTeamGoals, 0);
    const goalsOwn = awayMatches.reduce((totalGoals, match) =>
      totalGoals + match.awayTeamGoals, 0);

    return goalsFavor - goalsOwn;
  }

  async calculateAwayEfficiency(teamId: number): Promise<string> {
    const totalPoints = await this.calculateAwayPoints(teamId);
    const totalGames = await this.calculateTotalAwayGames(teamId);

    const totalPossiblePoints = totalGames * 3;
    const efficiency = `${((totalPoints / totalPossiblePoints) * 100).toFixed(2)}`;

    return efficiency;
  }
}
