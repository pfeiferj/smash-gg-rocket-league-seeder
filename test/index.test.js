const {expect} = require('chai');
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

const logger = {
  log: ()=>{},
};

describe('Index', function(){
  it('it should load the .env file', function() {
    const dotenv = sinon.spy();
    proxyquire('../src/index', {
      'dotenv':{config: dotenv},
      './discord':{start:()=>{}},
      './smashSeeder':{},
      './logger': logger,
    });

    expect(dotenv.calledOnce).to.be.true;
  });

  describe('when a discord key is in the environment variables', function() {
    describe('and there is no slug argument', function(){
      it('it should not run the seeder', function() {
        process.argv = [];
        const discord = sinon.spy();
        const smashSeeder = sinon.stub();
        smashSeeder.returns(new Promise(res => res()));
        proxyquire('../src/index', {
          'dotenv': {config:()=>{}},
          './discord': {start:discord},
          './smashSeeder':{run:smashSeeder},
          './logger': logger,
        });

        expect(smashSeeder.calledOnce).to.be.false;
      });

      it('it should start the discord server', function() {
        const discord = sinon.spy();
        process.env.DISCORD_KEY = 'test';
        process.argv = [];
        proxyquire('../src/index', {
          'dotenv': {config:()=>{}},
          './discord': {start:discord},
          './smashSeeder':{},
          './logger': logger,
        });
        expect(discord.calledOnce).to.be.true;
      });
    });

    describe('and there is a slug argument', function() {
      it('it should not start the discord server', function() {
        process.argv = ['','slug=test'];
        const discord = sinon.spy();
        const smashSeeder = sinon.stub();
        smashSeeder.returns(new Promise(res => res()));
        proxyquire('../src/index', {
          'dotenv': {config:()=>{}},
          './discord': {start:discord},
          './smashSeeder':{run:smashSeeder},
          './logger': logger,
        });

        expect(discord.calledOnce).to.be.false;
      });

      it('it should run the seeder', function() {
        process.argv = ['','slug=test'];
        const smashSeeder = sinon.stub();
        smashSeeder.returns(new Promise(res => res()));
        proxyquire('../src/index', {
          'dotenv': {config:()=>{}},
          './discord': {start:()=>{}},
          './smashSeeder':{run:smashSeeder},
          './logger': logger,
        });

        expect(smashSeeder.calledOnce).to.be.true;
      });
    });
  });
});
