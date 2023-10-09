import * as chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { app } from '../app'; // Importe sua instância do aplicativo

chai.use(chaiHttp);
const expect = chai.expect;

describe('TeamController', () => {
  describe('/GET /teams', () => {
    it('Deve retornar uma lista de times com status 200', (done) => {
      chai
        .request(app)
        .get('/teams')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('/GET /teams/:id', () => {
    it('Deve retornar um time com status 200 quando um ID válido é fornecido', (done) => {
      chai
        .request(app)
        .get('/teams/1') // Substitua 1 pelo ID válido que você deseja testar
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.exist;
          expect(res.body.teamName).to.exist;
          done();
        });
    });

    it('Deve retornar status 404 quando um ID de time não encontrado é fornecido', (done) => {
      chai
        .request(app)
        .get('/teams/999') // Substitua 999 por um ID que não existe
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('NOT_FOUND');
          done();
        });
    });
  });
});
