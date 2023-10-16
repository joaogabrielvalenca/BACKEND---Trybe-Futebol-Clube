import * as chai from 'chai';
import * as sinon from 'sinon';
import Match from '../database/models/Match';
import { App } from '../app';
import { matches, inProgress, notInProgress, inProgressMatch } from './mocks/Match.mock';

// @ts-ignore
import chaiHttp = require('chai-http');
import { Request, Response } from 'express';
import AuthMiddleware from '../middlewares/auth.middleware';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('/matches', function () { 

  beforeEach(function () { 
    let request: Request
    let response: Response
    const token = 
    sinon.restore(); 
  });

  it('Retorna 200 se fizer requisição get na rota /matches', async function () {
    sinon.stub(Match, 'findAll').resolves(matches as any);

    const response = await chai.request(app).get('/matches')

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(matches);
  });
  it('Retorna 200 se fizer requisição na get rota /matches?inProgress=true', async function () {
    sinon.stub(Match, 'findAll').resolves(inProgress as any);

    const response = await chai.request(app).get('/matches?inProgress=true');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(inProgress);
  });

  it('Retorna 200 se fizer requisição na get rota /matches?inProgress=false', async function () {
    sinon.stub(Match, 'findAll').resolves(notInProgress as any);

    const response = await chai.request(app).get('/matches?inProgress=false');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(notInProgress);
  });
  it('Retorna 400 se fizer em rota diferente de /matches?inProgress=true/false', async function () {
    const response = await chai.request(app).get('/matches?inProgress=verdadeiro');

    expect(response.status).to.equal(400);
  })
  // it('Retorna status 401 se a partida não for encontrada na rota patch', async function () {
  //   sinon.stub(Match, 'findByPk').resolves(null);
  //   sinon.stub(AuthMiddleware, 'validateToken').returns()
  //   const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwiaWF0IjoxNjk3MjIwNzEzfQ.TfahqbA1igNTq37UTR87yYXi0CKRpFdXvNzfBPaCSyk'

  //   const response = await chai.request(app).patch('/matches/155/finish').set('Authorization', token)

  //   expect(response.status).to.equal(500);
  //   // expect(response.body).to.deep.equal({ error: 'Partida não encontrada' });
  // });

  // it('Retorna status 200 e finaliza a partida no banco de dados', async function () {
  //   sinon.stub(Match, 'findByPk').resolves(inProgressMatch)

  //   const authMiddleware = new AuthMiddleware()

  //   sinon.stub(authMiddleware, 'validateToken').returns()

  //   const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwiaWF0IjoxNjk3MjIwNzEzfQ.TfahqbA1igNTq37UTR87yYXi0CKRpFdXvNzfBPaCSyk'
    
  //   const response = await chai.request(app).patch('/matches/1/finish').set('Authorization', token)

  //   expect(response.status).to.equal(200);
  //   expect(response.body).to.deep.equal({ message: 'Finished' });
  // });
  // it('Retorna status 200 e finaliza a partida no banco de dados', async function () {
  //   sinon.stub(Match, 'findByPk').resolves(inProgressMatch);
  
  //   const authMiddleware = new AuthMiddleware();
  
  //   sinon.stub(authMiddleware, 'validateToken').callsFake(token) => {
  //     // Você deve retornar um objeto Response válido
  //     return res.status(200).json({ message: 'Token valid' });
  //   });
  //   const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZDI6MiwiZW1haWwiOiJ1c2VyQHVzZXIuY29tIiwiaWF0IjoxNjk3MjIwNzEzfQ.TfahqbA1igNTq37UTR87yYXi0CKRpFdXvNzfBPaCSyk';
  
  
  //   const response = await chai.request(app).patch('/matches/1/finish').set('Authorization', token);
  
  //   expect(response.status).to.equal(200);
  //   expect(response.body).to.deep.equal({ message: 'Finished' });
  // });
})