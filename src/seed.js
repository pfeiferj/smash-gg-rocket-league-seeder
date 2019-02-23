const rankData = require('./rankData');
const STANDARD = 3;
const DOUBLES = 2;
const SOLO_DUEL = 1;
const STANDARD_LABEL = 'Ranked Standard 3v3';
const DOUBLES_LABEL = 'Ranked Doubles 2v2';
const SOLO_DUEL_LABEL = 'Ranked Duel 1v1';

/**
 * Gets a weighted average of the players ranks
 * @private
 */
function getEntrantRank(players, eventType) {
  if(eventType === SOLO_DUEL){
    return players[0].rank;
  }

  let sortedPlayers = players.sort((playerA, playerB) => {
    return playerB.rank - playerA.rank;
  });

  if(eventType === DOUBLES) {
    return Math.floor((sortedPlayers[0].rank * 2 + sortedPlayers[1].rank) / 3);
  } else if(eventType === STANDARD) {
    return Math.floor((sortedPlayers[0].rank * 3 + sortedPlayers[1].rank * 2 + sortedPlayers[2].rank) / 6);
  }
}

/**
 * Gets the top rank of a player for the current event type
 * @private
 */
function getTopRank(connectedAccounts, eventType) {
  let topRank = 0;
  for (const accountType in connectedAccounts) { //if there are multiple accounts, we only want the best rank
    const ranks = rankData.getRanks(accountType, connectedAccounts[accountType].value);
    const eventTypeRank = //only get the rank for this event type
      eventType   === STANDARD  ? ranks[STANDARD_LABEL]
      : eventType === DOUBLES   ? ranks[DOUBLES_LABEL]
      : eventType === SOLO_DUEL ? ranks[SOLO_DUEL_LABEL]
      : 0;
    topRank = eventTypeRank > topRank ? eventTypeRank : topRank;
  }
  return topRank;
}

/**
 * Generates a new seeding for the entrants based on rank data
 * @public
 */
function getSeeds(standings, eventType) {
  let seedData = [];
  for (let standing of standings) {
    let participants = [];
    for (const participant of standing.entrant.participants) {
      const topRank = getTopRank(participant.connectedAccounts, eventType);
      const rankedParticipant = {
        id: participant.id,
        name: participant.gamerTag,
        rank: topRank
      };
      participants.push(rankedParticipant);
    }
    let entrant = {
      id: standing.id,
      participants: participants,
      name: standing.entrant.name,
      rank: getEntrantRank(participants, eventType)
    };
    seedData.push(entrant);
  }
  const sortedSeeds = seedData.sort((entrantA, entrantB) => {
    return entrantB.rank - entrantA.rank;
  });

  return sortedSeeds;
}

module.exports = {
  getSeeds
};
