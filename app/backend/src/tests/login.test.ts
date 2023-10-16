import * as chai from 'chai';
import * as sinon from 'sinon';
import User from '../database/models/User';
import { App } from '../app';
import { teams, team } from './mocks/Team.mock';
// @ts-ignore
import chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('POST /login', function () { 
  beforeEach(function () { 
    sinon.restore(); 
  });

  it('Retorna 400 se não tiver username', async function () {
    const body = {
      email: '', 
      password: 'abc'
    }
    const response = await chai.request(app).post('/login').send(body)
    expect(response.status).to.be.equal(400)
  })

  it('Retorna 400 se não tiver password', async function () {
    const body = {
      email: 'biridin@gmail.com',
      password: ''
    }
    const response = await chai.request(app).post('/login').send(body)
    expect(response.status).to.be.equal(400)
  })

  it('Retorna 401 se username não existir no banco', async function () {
    const body = {
      email: 'tadeputaria@hotmail.com',
      password: 'ehscam'
    }
    sinon.stub(User, 'findOne').resolves(null)

    const response = await chai.request(app).post('/login').send(body)

    expect(response.status).to.be.equal(401)
  })

  it('Retorna 401 se senha estiver errada', async function() {
    const body = {
      email: 'user@user.com',
      password: 'abluble'
    }

    const response = await chai.request(app).post('/login').send(body)
    expect(response.status).to.be.equal(401);
  })

  it ('Retorna 200 se email e password estiverem corretos', async function () {
    const body = {
      email: 'user@user.com',
      password: 'secret_user'
    }
    
    const response = await chai.request(app).post('/login').send(body)
    expect(response.status).to.be.equal(200)
    expect(response.body).to.have.property('token')
  })
})