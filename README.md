# smash-gg-rocket-league-seeder
Seeds a Rocket League smash.gg tournament using rank data from Rocket League. Originally written for [Boost Legacy](https://boostlegacy.org) - [discord](https://discord.gg/boostlegacy) | [twitter](https://twitter.com/boostlegacy) | [twitch](https://twitch.tv/boostlegacy)

_Note: The default configuration uses random values for the rank data, to get actual rank data you must update the settings in the .env file with an API key for rocketleague.tracker.network or rltracker.pro._

## Quick Start
Install dependencies
```
npm install
```

Create a .env with your smash.gg API key and rocketleague.tracker.network or rltracker.pro API key. (If you do not have a rocketleague.tracker.network or rltracker.pro API key you can set the .env file to use random data to test functionality)
```
cp .env.example .env
vim .env
```

Run the seeder on your tournament
```
npm start -- slug=your-tournament-slug
```
_Note: the tournament slug is the part of the tournament URL after tournament/. E.g. for `https://smash.gg/tournament/whiteout/details` the slug is `whiteout`._

## Resources
[Smash.gg Developer API](https://developer.smash.gg/docs/intro)
[rocketleague.tracker.network](https://rocketleague.tracker.network)
[rltracker.pro](https://rltracker.pro)
