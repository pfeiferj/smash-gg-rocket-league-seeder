const {expect} = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');


const mocks = {
  'dotenv':{config: sinon.spy()},
  './discord':{start: sinon.spy()},
  './smashSeeder':{run: sinon.stub()},
  './logger': {log: sinon.spy(), error: sinon.spy()},
};

describe('Index', function(){
  beforeEach(function(){
    mocks.dotenv.config.resetHistory();
    mocks['./discord'].start.resetHistory();
    mocks['./smashSeeder'].run.resetHistory();
    mocks['./logger'].log.resetHistory();
    mocks['./logger'].error.resetHistory();

    mocks['./smashSeeder'].run.returns(new Promise(res=>res()));
  });
  it('it should load the .env file', function() {
    proxyquire('../src/index', mocks);

    expect(mocks.dotenv.config.calledOnce).to.be.true;
  });

  describe('when a discord key is in the environment variables', function() {
    describe('and there is no slug argument', function(){
      it('it should not run the seeder', function() {
        process.env.DISCORD_KEY = 'test';
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
        process.env.DISCORD_KEY = 'test';
        process.argv = ['','slug=test'];
        proxyquire('../src/index', mocks);

        expect(mocks['./discord'].start.calledOnce).to.be.false;
      });

      it('it should run the seeder', function() {
        process.env.DISCORD_KEY = 'test';
        process.argv = ['','slug=test'];
        proxyquire('../src/index', mocks);

        expect(mocks['./smashSeeder'].run.calledOnce).to.be.true;
      });
    });
  });

  describe('when there is no discord key in the environment variables', function() {
    describe('and there is a slug argument', function() {
      it('it should not start the discord server', function() {
        process.env.DISCORD_KEY = '';
        process.argv = ['','slug=test'];
        proxyquire('../src/index', mocks);

        expect(mocks['./discord'].start.calledOnce).to.be.false;
      });

      it('it should run the seeder', function() {
        process.env.DISCORD_KEY = '';
        process.argv = ['','slug=test'];
        proxyquire('../src/index', mocks);

        expect(mocks['./smashSeeder'].run.calledOnce).to.be.true;
      });
    });

    describe('and there is not a slug argument', function() {
      it('it should not start the discord server', function() {
        process.env.DISCORD_KEY = '';
        process.argv = [];
        proxyquire('../src/index', mocks);

        expect(mocks['./discord'].start.calledOnce).to.be.false;
      });

      it('it should not run the seeder', function() {
        process.env.DISCORD_KEY = '';
        process.argv = [];
        proxyquire('../src/index', mocks);

        expect(mocks['./smashSeeder'].run.calledOnce).to.be.false;
      });

      it('it should log information about the program', function() {
        process.env.DISCORD_KEY = '';
        process.argv = [];
        proxyquire('../src/index', mocks);

        expect(mocks['./logger'].log.calledOnce).to.be.true;
      });
    });
  });

  describe('when smashSeeder.run throws an error', function() {
    it('it should log an error', async function() {
      const reject = 'test error';
      const prom = new Promise((res, rej) => rej(reject));
      mocks['./smashSeeder'].run.returns(prom);
      process.argv = ['', 'slug=test'];
      proxyquire('../src/index', mocks);
      await new Promise(res=>setTimeout(res,0)); //timeout so that the catch function gets called
      
      expect(mocks['./logger'].error.calledWith(reject)).to.be.true;
    });
  });
});
