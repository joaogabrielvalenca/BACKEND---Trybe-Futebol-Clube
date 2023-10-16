import * as chai from 'chai';
import * as sinon from 'sinon';
import Team from '../database/models/Team';
import { App } from '../app';
import { teams, team } from './mocks/Team.mock';
// @ts-ignore
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

  describe('/GET /teams e /teams:id', function () {
    beforeEach(function () {
      sinon.restore();
    })
    it('Deve retornar uma lista de times com status 200', async function() {
      sinon.stub(Team, 'findAll').resolves(teams as any);

      const response = await chai.request(app).get('/teams')

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(teams);
    });
 
    
    it('Deve retornar um time com status 200 quando um ID válido é fornecido', async function () {
      sinon.stub(Team, 'findByPk').resolves(team as any);

      const { status, body } = await chai.request(app).get('/teams/1')

      expect(status).to.equal(200);
      expect(body).to.deep.equal(team);
    });

    it('Deve retornar status 404 quando um ID de time não encontrado é fornecido', async function() {
      sinon.stub(Team, 'findByPk').resolves(null);

      const { status, body } = await chai.request(app).get('/teams/1')

      expect(status).to.equal(404);
      expect(body.message).to.equal(undefined);
      });
      
      // afterEach(sinon.restore);
    });