const {expect} = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');


const mocks = {
  'dotenv':{config: sinon.spy()},
  './discord':{start: sinon.spy()},
  './smashSeeder':{run: sinon.stub()},
  './logger': {log: sinon.spy()},
};
mocks['./smashSeeder'].run.returns(new Promise(res=>res()));

describe('Index', function(){
  beforeEach(function(){
    mocks.dotenv.config.resetHistory();
    mocks['./discord'].start.resetHistory();
    mocks['./smashSeeder'].run.resetHistory();
    mocks['./logger'].log.resetHistory();
  });
  it('it should load the .env file', function() {
    proxyquire('../src/index', mocks);

    expect(mocks.dotenv.config.calledOnce).to.be.true;
  });

  describe('when a discord key is in the environment variables', function() {
    describe('and there is no slug argument', function(){
      it('it should not run the seeder', function() {
        process.argv = [];
        proxyquire('../src/index', mocks);

        expect(mocks['./smashSeeder'].run.calledOnce).to.be.false;
      });

      it('it should start the discord server', function() {
        process.env.DISCORD_KEY = 'test';
        process.argv = [];
        proxyquire('../src/index', mocks);
        expect(mocks['./discord'].start.calledOnce).to.be.true;
      });
    });

    describe('and there is a slug argument', function() {
      it('it should not start the discord server', function() {
        process.argv = ['','slug=test'];
        proxyquire('../src/index', mocks);

        expect(mocks['./discord'].start.calledOnce).to.be.false;
      });

      it('it should run the seeder', function() {
        process.argv = ['','slug=test'];
        proxyquire('../src/index', mocks);

        expect(mocks['./smashSeeder'].run.calledOnce).to.be.true;
      });
    });
  });
});
