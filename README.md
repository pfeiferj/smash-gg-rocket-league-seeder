# smash-gg-rocket-league-seeder
# THIS PROJECT IS NO LONGER MAINTAINED
# PSYONIX DOES NOT PROVIDE A PUBLIC RANK API
Psyonix has promised for the last 5 years that they were "close" to releasing a public api. Here's a thread that started over three years ago: [first post](https://www.reddit.com/r/RocketLeague/comments/a0alwy/state_of_public_api/) ... [last post](https://www.reddit.com/r/RocketLeague/comments/lbyf9k/state_of_public_api_v5/). In the time since Psyonix started promising us the API was coming soon access has actually gotten worse. See [this post](https://www.reddit.com/r/RocketLeague/comments/97p7oh/rlstats_api_shut_down_by_psyonix/) from four years ago. Since then the other stat tracker sites have shut down all access to the api through their own sites (at least as far as I know). I suspect this lack of access through other sites is due to threats from Psyonix to stop giving access.

Without access to a stats API this project is largely useless. There's potential to extend it to read in from a rank field in the smash.gg registration of a user, but that also means you either have to vet all of the registrations anyways or you just have to trust players (generally not a great idea).

If Psyonix ever actually follows through on giving public API access I will probably start updating this project again. However, after seeing how Psyonix has treated the community in regards to API access since the launch of the game in 2015 I find it extremely unlikely that easy access to the API will ever happen.

# How the project used to work.

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
