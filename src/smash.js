const {GraphQLClient} = require('graphql-request');
const smash_endpoint = "https://api.smash.gg/gql/alpha";
const graphQLClient = new GraphQLClient(smash_endpoint, {
  headers: {
    authorization: "Bearer " + process.env.SMASH_API_KEY,
  }
});

/**
 * Gets information about a tournament from smash.gg
 * @public
 */
async function getTournamentInfo(slug){
  const query = /* GraphQL */ `
    query PrefixSearchAttendees($tourneySlug:String!) {
      tournament(slug: $tourneySlug) {
        id
        name

        events {
          id
          name
          entrantSizeMin
          phases(state: CREATED) {
            numSeeds
            id
            name
          }
        }
      }
    }
  `;
  const variables = {
    "tourneySlug": slug
  };

  const data = await graphQLClient.request(query, variables);
  return data.tournament;
}

/**
 * Gets the current standings of the smash.gg phase including information about each entrant and it's participants
 * @public
 */
async function getPhaseStandings(phase){
  const SEEDS_PER_PAGE = 50;
  const query = /*GraphQL*/ `
    query GetPhaseSeeds($phaseId:Int!,$page:Int!,$perPage:Int!) {
      phase(id:$phaseId){
        id
        paginatedSeeds(query:{
          page: $page
          perPage: $perPage
        })
        {
          nodes{
            id
            seedNum
            entrant{
              id
              name
              participants{
                id
                gamerTag
                connectedAccounts
              }
            }
          }
        }
      }
    }
  `;  

  let phaseStandings = [];
  for(let i = 0; i < phase.numSeeds/SEEDS_PER_PAGE; i++){
    const variables = {phaseId: phase.id, page:i, perPage:SEEDS_PER_PAGE};
    const seedingData = await graphQLClient.request(query,variables);
    phaseStandings.push(...seedingData.phase.paginatedSeeds.nodes);
  }
  return phaseStandings;
}

/**
 * Updates seeding on smash.gg for a phase
 * @public
 */
async function seedPhase(phaseId, seeds){
  const mutation = /*GraphQL*/ `
    mutation UpdatePhaseSeeding ($phaseId: Int!, $seedMapping: [UpdatePhaseSeedInfo]!) {
      updatePhaseSeeding (phaseId: $phaseId, seedMapping: $seedMapping) {
        id
      }
    }
  `;

  let smashSeeding = [];
  
  for(let i = 0; i < seeds.length; i++){
    const smashSeed = {
      seedId: seeds[i].id,
      seedNum: i + 1
    };
    smashSeeding.push(smashSeed);
  }

  const variables = {
    phaseId: phaseId,
    seedMapping: smashSeeding
  }; 

  const result = await graphQLClient.request(mutation, variables);

  return result;
}

module.exports = {
  getTournamentInfo,
  getPhaseStandings,
  seedPhase
};
