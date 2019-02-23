require('dotenv').config();
const smash = require('./smash');
const seed = require('./seed');
const exporter = require('./exporter');
const namedArgs = {};
for(const arg of process.argv){
  let argParts = arg.split('=');
  if(argParts.length > 1){
    namedArgs[argParts[0]] = argParts[1];
  }
}
const slug = namedArgs.slug;

/**
 * Main function to allow await syntax
 */
async function main() {
  const tournamentInfo = await smash.getTournamentInfo(slug);

  for (const event of tournamentInfo.events) {
    const eventType = event.entrantSizeMin; 
    for(const phase of event.phases){
      const phaseStandings = await smash.getPhaseStandings(phase, eventType);
      const seeds = seed.getSeeds(phaseStandings, eventType);
      const seedingPromise = smash.seedPhase(phase.id, seeds);
      const seedingFile = await exporter.exportSeeding(seeds);
      console.log("seeding data saved in: " + seedingFile);
      try{
        await seedingPromise;
        console.log('Smash.gg seeding for ' + event.name + " - " + phase.name + ' successfully updated');
      } catch(e) {
        console.warn('Could not update smash.gg seeding for ' + event.name + " - " + phase.name + '.', e.message.split(':')[0]);
      }
    }
  }
}

main().catch(e=>{console.error(e);});
