import { Request, Response } from 'express';
import TeamService from '../services/team.service';
import LeaderboardAwayService from '../services/leaderboardAway.service';
import TeamAttributes from '../Interfaces/TeamAttributes';

export default class LeaderboardAwayController {
  constructor(
    private teamService = new TeamService(),
    private leaderboardAwayService = new LeaderboardAwayService(),
  ) {}

  public async getAwayLeaderboard(req: Request, res: Response) {
    try {
      const awayTeams = await this.teamService.getAllTeams();
      const leaderboardDataAway = await Promise.all(
        awayTeams.map(async (team) => this.calculateLeaderboardAwayData(team)),
      );
      leaderboardDataAway.sort((a, b) => {
        if (a.totalPoints === b.totalPoints) {
          if (a.goalsBalance === b.goalsBalance) {
            return b.goalsFavor - a.goalsFavor;
          }
          return b.goalsBalance - a.goalsBalance;
        }
        return b.totalPoints - a.totalPoints;
      });
      return res.status(200).json(leaderboardDataAway);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar o leaderboard' });
    }
  }

  // private async calculateLeaderboardAwayData(team: TeamAttributes) {
  //   const { teamName } = team;
  //   const totalPoints = await this.leaderboardAwayService.calculateAwayPoints(team.id);
  //   const totalGames = await this.leaderboardAwayService.calculateTotalAwayGames(team.id);
  //   const totalVictories = await this.leaderboardAwayService.calculateAwayVictories(team.id);
  //   const totalDraws = await this.leaderboardAwayService.calculateTotalAwayDraws(team.id);
  //   const totalLosses = await this.leaderboardAwayService.calculateTotalAwayLosses(team.id);
  //   const goalsFavor = await this.leaderboardAwayService.calculateAwayGoalsFavor(team.id);
  //   const goalsOwn = await this.leaderboardAwayService.calculateAwayGoalsOwn(team.id);
  //   const goalsBalance = await this.leaderboardAwayService.calculateAwayGoalsBalance(team.id);
  //   const efficiency = await this.leaderboardAwayService.calculateAwayEfficiency(team.id);
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

  private async calculateLeaderboardAwayData(team: TeamAttributes) {
    const { teamName } = team;
    const response = await this.leaderboardAwayService.allFunctionsResponse(team.id);
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
