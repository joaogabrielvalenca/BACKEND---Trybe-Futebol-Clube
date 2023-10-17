import { Request, Response } from 'express';
import TeamService from '../services/team.service';
import LeaderboardHomeService from '../services/leaderboardHome.service';
import TeamAttributes from '../Interfaces/TeamAttributes';

export default class LeaderboardHomeController {
  constructor(
    private teamService = new TeamService(),
    private leaderboardHomeService = new LeaderboardHomeService(),
  ) {}

  public async getHomeLeaderboard(req: Request, res: Response) {
    try {
      const homeTeams = await this.teamService.getAllTeams();
      const leaderboardData = await Promise.all(
        homeTeams.map(async (team) => this.calculateLeaderboardHomeData(team)),
      );
      leaderboardData.sort((a, b) => {
        if (a.totalPoints === b.totalPoints) {
          if (a.goalsBalance === b.goalsBalance) {
            return b.goalsFavor - a.goalsFavor;
          }
          return b.goalsBalance - a.goalsBalance;
        }
        return b.totalPoints - a.totalPoints;
      });
      return res.status(200).json(leaderboardData);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar o leaderboard' });
    }
  }

  // private async calculateLeaderboardHomeData(team: TeamAttributes) {
  //   const { teamName } = team;
  //   const totalPoints = await this.leaderboardHomeService.calculateHomePoints(team.id);
  //   const totalGames = await this.leaderboardHomeService.calculateTotalHomeGames(team.id);
  //   const totalVictories = await this.leaderboardHomeService.calculateHomeVictories(team.id);
  //   const totalDraws = await this.leaderboardHomeService.calculateTotalHomeDraws(team.id);
  //   const totalLosses = await this.leaderboardHomeService.calculateTotalHomeLosses(team.id);
  //   const goalsFavor = await this.leaderboardHomeService.calculateHomeGoalsFavor(team.id);
  //   const goalsOwn = await this.leaderboardHomeService.calculateHomeGoalsOwn(team.id);
  //   const goalsBalance = await this.leaderboardHomeService.calculateHomeGoalsBalance(team.id);
  //   const efficiency = await this.leaderboardHomeService.calculateHomeEfficiency(team.id);
  //   return {
  //     name: teamName,
  //     totalPoints,
  //     totalGames,
  //     totalVictories,
  //     totalDraws,
  //     totalLosses,
  //     goalsFavor,
  //     goalsOwn,
  //     goalsBalance,
  //     efficiency,
  //   };
  // }

  private async calculateLeaderboardHomeData(team: TeamAttributes) {
    const { teamName } = team;
    const response = await this.leaderboardHomeService.allFunctionsResponse(team.id);
    return {
      name: teamName,
      totalPoints: response.points,
      totalGames: response.games,
      totalVictories: response.wins,
      totalDraws: response.draws,
      totalLosses: response.loss,
      goalsFavor: response.gFavor,
      goalsOwn: response.gOwn,
      goalsBalance: response.gBalance,
      efficiency: response.eff,
    };
  }
}
