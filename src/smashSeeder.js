const smash = require('./smash');
const seed = require('./seed');
const exporter = require('./exporter');
let currentProgress = 'No progress data.';

/**
 * Runs seeding on smash.gg against the provided tournament
 * @public
 */
async function run(slug) {
  const tournamentInfo = await smash.getTournamentInfo(slug);

  let seedings = [];
  for (const event of tournamentInfo.events) {
    const eventType = event.entrantSizeMin; 
    for(const phase of event.phases){
      const phaseStandings = await smash.getPhaseStandings(phase, eventType);
      currentProgress = `${event.name}: ${phase.name}`;
      const seeds = await seed.getSeeds(phaseStandings, eventType);
      const seedingPromise = smash.seedPhase(phase.id, seeds);
      const seedingFileData = await exporter.exportSeeding(seeds);
      console.log("seeding data saved in: " + seedingFileData.file);
      let success = false;
      try{
        await seedingPromise;
        console.log('Smash.gg seeding for ' + event.name + " - " + phase.name + ' successfully updated');
        success = true;
      } catch(e) {
        console.warn('Could not update smash.gg seeding for ' + event.name + " - " + phase.name + '.', e.message.split(':')[0]);
      }
      seedings.push({name: `${event.name}: ${phase.name}`, success, content: seedingFileData.content, file: seedingFileData.name});
    }
  }
  return seedings;
}

function getCurrentProgress() {
  return `\n${currentProgress}\n${seed.getCurrentProgress()}`;
}

module.exports = {
  run,
  getCurrentProgress,
};
