const rankApis = require('rocket-league-apis-client');

const STANDARD_LABEL = '3v3';
const DOUBLES_LABEL = '2v2';
const SOLO_DUEL_LABEL = '1v1';

const PLATFORMS = {
  steam: 0,
  psn: 1,
  xboxlive: 2,
};

const RANK_SERVICE_URLS = {
  ROCKETLEAGUE_TRACKER_NETWORK: 'https://20kiyaost7.execute-api.us-west-2.amazonaws.com/prod',
  RLTRACKER_PRO: 'http://rltracker.pro/api/profile/get',
};

let RLClient = null;
if(process.env.RANK_SERVICE !== "RANDOM"){
  const options = {
    tracker: rankApis.TRACKER[process.env.RANK_SERVICE],
    apiUrl: RANK_SERVICE_URLS[process.env.RANK_SERVICE],
    apiKey: process.env.RANK_SERVICE_KEY,
  };
  RLClient = rankApis.default(options);
}



/**
 * Creates a random rank value
 * @private
 */
function randomRank(){
  return Math.floor(Math.random() * 2000);
}

/**
 * Gets random rank values for player
 * @private
 */
function getRandomRanks() { // Normally we would get rank data from a third party service
  let rankData = {}; // we're just going to use random values to simulate rank data
  rankData[STANDARD_LABEL]  = randomRank();
  rankData[DOUBLES_LABEL]   = randomRank();
  rankData[SOLO_DUEL_LABEL] = randomRank();
  return rankData;
}

/**
 * Gets rank data from third party service
 * @private
 */
async function getRealRanks(accountType, accountSlug) {
  let ranks;
  try {
    ranks = await RLClient(PLATFORMS[accountType], accountSlug);
  } catch (e) {
    console.warn("\nFailed to get rank data for: " + accountType + '.' + accountSlug, e);
    ranks = {player: {}};
    ranks.player[SOLO_DUEL_LABEL] = 0;
    ranks.player[DOUBLES_LABEL] = 0;
    ranks.player[STANDARD_LABEL] = 0;
  }
  return ranks.player;
}

/**
 * Gets rank data
 * @public
 */
async function getRanks(accountType, accountSlug){
  if(process.env.RANK_SERVICE === "RANDOM") {
    return getRandomRanks();
  } else {
    return getRealRanks(accountType, accountSlug);
  }
}

module.exports ={
  getRanks,
};
