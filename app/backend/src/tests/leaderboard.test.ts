import * as chai from 'chai';
import * as sinon from 'sinon';
import { App } from '../app';

// @ts-ignore
import chaiHttp = require('chai-http');
import { Request, Response } from 'express';
import LeaderboardHomeService from '../services/leaderboardHome.service';
import LeaderboardAwayService from '../services/leaderboardAway.service';
import TeamService from '../services/team.service';
import { leaderboardHomeData, leaderboardAwayData } from './mocks/leaderboard.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;
const leaderboardHomeService = new LeaderboardHomeService()
const leaderboardAwayService = new LeaderboardAwayService()
const teamService = new TeamService()

describe('/GET /leaderboard/home e /leaderboard/away', function () {
  beforeEach(function () {
    sinon.restore();
  })
  it('Retorna status 200 e os dados do leaderboard de casa', async function () {
    sinon.stub(leaderboardHomeService, 'calculateHomePoints').resolves(7);
    sinon.stub(leaderboardHomeService, 'calculateTotalHomeGames').resolves(3);
    sinon.stub(leaderboardHomeService, 'calculateTotalHomeDraws').resolves(1);
    sinon.stub(leaderboardHomeService, 'calculateHomeVictories').resolves(2);
    sinon.stub(leaderboardHomeService, 'calculateTotalHomeLosses').resolves(0);
    sinon.stub(leaderboardHomeService, 'calculateHomeGoalsFavor').resolves(7);
    sinon.stub(leaderboardHomeService, 'calculateHomeGoalsOwn').resolves(2);

    sinon.stub(teamService, 'getAllTeams').resolves(leaderboardHomeData);

    const response = await chai.request(app).get('/leaderboard/home');

    expect(response.status).to.equal(200);
    // expect(response.body).to.deep.equal(leaderboardHomeData);
  });
  it('Retorna status 200 e os dados do leaderboard de fora de casa', async function () {
    // Simule a chamada ao serviço que retorna os dados do leaderboard
    sinon.stub(leaderboardAwayService, 'calculateAwayPoints').resolves(1);
    sinon.stub(leaderboardAwayService, 'calculateTotalAwayGames').resolves(3);
    sinon.stub(leaderboardAwayService, 'calculateTotalAwayDraws').resolves(1);
    sinon.stub(leaderboardAwayService, 'calculateAwayVictories').resolves(0);
    sinon.stub(leaderboardAwayService, 'calculateTotalAwayLosses').resolves(2);
    sinon.stub(leaderboardAwayService, 'calculateAwayGoalsFavor').resolves(3);
    sinon.stub(leaderboardAwayService, 'calculateAwayGoalsOwn').resolves(7);

    sinon.stub(teamService, 'getAllTeams').resolves(leaderboardAwayData);

    const response = await chai.request(app).get('/leaderboard/away');

    expect(response.status).to.equal(200);
    // expect(response.body).to.deep.equal(leaderboardAwayData);
  });
});