require('dotenv').config();
const smashSeeder = require('./smashSeeder');
const discord = require('./discord');
const logger = require('./logger');

const namedArgs = {};
for(const arg of process.argv){
  let argParts = arg.split('=');
  if(argParts.length > 1){
    namedArgs[argParts[0]] = argParts[1];
  }
}
const slug = namedArgs.slug;


if(!slug && process.env.DISCORD_KEY){
  discord.start();
} else if(slug) {
  smashSeeder.run(slug).catch(e=>{
    logger.error(e);
  });
} else {
  logger.log("Please provide a slug by running 'npm start -- slug=tournament_slug_name' or provide a discord api key to your .env file");
}
