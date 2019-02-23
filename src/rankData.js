const STANDARD_LABEL = 'Ranked Standard 3v3';
const DOUBLES_LABEL = 'Ranked Doubles 2v2';
const SOLO_DUEL_LABEL = 'Ranked Duel 1v1';

/**
 * Creates a random rank value
 * @private
 */
function randomRank(){
  return Math.floor(Math.random() * 2000);
}

/**
 * Gets random rank data
 * @public
 */
function getRanks(){ // Normally we would get rank data from a third party service
  let rankData = {}; // we're just going to use random values to simulate rank data
  rankData[STANDARD_LABEL]  = randomRank();
  rankData[DOUBLES_LABEL]   = randomRank();
  rankData[SOLO_DUEL_LABEL] = randomRank();
  return rankData;
}

module.exports ={
  getRanks
};
