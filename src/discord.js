const Discord = require('discord.js');
const smashSeeder = require('./smashSeeder');

/**
 * Implements a discord server
 */
function start(){
  const client = new Discord.Client();

  client.login(process.env.DISCORD_KEY);

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', async msg => {
    if (msg.content.startsWith('!seed')) {
      if(process.env.ADMIN_ROLE !== undefined && !msg.member.roles.array().find(role => role.name === process.env.ADMIN_ROLE)){
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
        for(const seedData of seedings){
          replyText += "\n"
            + `${seedData.name}\n` 
            + `${seedData.success ? 'Succeded' : 'Failed'} writing seed data to smash.gg.\n`
            + `${seedData.content}\n`;
        }
        msg.reply(replyText);
      } catch(e) {
        msg.reply(`Failed to seed ${msgParts[1]}. Please ensure you have a valid tournament slug and that the bracket has not started.`);
        console.log(e);
      }
    }
    if (msg.content.startsWith('!progress')){
      if(process.env.ADMIN_ROLE !== undefined && !msg.member.roles.array().find(role => role.name === process.env.ADMIN_ROLE)){
        return;
      }
      msg.reply(smashSeeder.getCurrentProgress());
    }
  });
}

module.exports = {
  start
};
