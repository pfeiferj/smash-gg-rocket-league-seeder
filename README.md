# smash-gg-rocket-league-seeder
Seeds a Rocket League smash.gg tournament using rank data from Rocket League. Originally written for [Boost Legacy](https://boostlegacy.org) - [discord](https://discord.gg/boostlegacy) | [twitter](https://twitter.com/boostlegacy) | [twitch](https://twitch.tv/boostlegacy)

_Note: This code as is uses random values for the rank data, to get actual rank data you must update the code to use a rank data service_

## Quick Start
Install dependencies
```
npm install
```

Create a .env with your smash.gg API key
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
