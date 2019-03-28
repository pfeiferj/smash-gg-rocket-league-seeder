const Discord = require('discord.js');
const smashSeeder = require('./smashSeeder');

/**
 * Checks if the user is eligible for the command
 * @private
 */
function isEligibleUser(msg){
  if(process.env.ADMIN_ROLE === undefined){
    return true;
  }
  const eligibleMember = msg.member.roles.array().find(role => {
    return role.name === process.env.ADMIN_ROLE;
  });
  return !!eligibleMember;
}

/**
 * seeds a tournament and replies to user with details about the seeding
 * @private
 */
async function seed(msg){
  if(!isEligibleUser(msg)) {
    return;
  }
  let msgParts = msg.content.split(' ');
  if(msgParts[1] === undefined){
    msg.reply('!seed requires a tournament slug, eg. "!seed tournament_slug_name". The tournament slug is the part of the tournament url after tournament/.');
    return;
  }
  msg.reply(`Beginning to seed ${msgParts[1]}. Please use !progress if you would like the current progress of the seeding process.`);
  try { 
    const seedings = await smashSeeder.run(msgParts[1]);
    let replyText = '';
    let files = [];
    for(const seedData of seedings){
      replyText += "\n"
        + `${seedData.name}\n` 
        + `${seedData.success ? 'Succeded' : 'Failed'} writing seed data to smash.gg.\n`;
      files.push(seedData.file);
    }
    msg.reply(replyText, {files});
  } catch(e) {
    msg.reply(`Failed to seed ${msgParts[1]}. Please ensure you have a valid tournament slug and that the bracket has not started.`);
    console.log(e);
  }
}


/**
 * Gives progress of current seeding process
 * @private
 */
function progress(msg) {
  if(!isEligibleUser(msg)) {
    return;
  }
  msg.reply(smashSeeder.getCurrentProgress());
}

/**
 * Implements a discord server
 * @public
 */
function start(){
  const client = new Discord.Client();

  client.login(process.env.DISCORD_KEY);

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', async msg => {
    if (msg.content.startsWith('!seed')) {
      seed(msg);
    }
    if (msg.content.startsWith('!progress')){
      progress(msg);
    }
  });
}

module.exports = {
  start
};
