const {expect} = require('chai');
const sinon = require('sinon');
const logger = require('../src/logger');


describe('Logger', function() {
  it('provides a log function', function() {
    expect(typeof logger.log).to.equal('function');
  });

  it('provides an error function', function() {
    expect(typeof logger.error).to.equal('function');
  });

  describe('#log', function() {
    beforeEach(function() {
      sinon.stub(console, 'log');
    });

    it('should call console.log with its arguments', function(){
      const log = 'test';
      logger.log(log);
      expect(console.log.calledWith(log)).to.be.true;
      console.log.restore();
    });
  });

  describe('#error', function() {
    beforeEach(function() {
      sinon.stub(console, 'error');
    });

    it('should call console.error with its arguments', function(){
      const log = 'test';
      logger.error(log);
      expect(console.error.calledWith(log)).to.be.true;
      console.error.restore();
    });
  });
});
