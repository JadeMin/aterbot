# AterBot ✨  
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](/LICENSE)  
<a href="https://discord.gg/44WtDkgxyk">
	<img src="https://img.shields.io/badge/discord-%2324292e.svg?&style=for-the-badge&logo=discord&logoColor=white" alt="Discord"/>
</a>



<!-- ## `01/17/2023`, Now using Repl because Heroku isn't free anymore. -->
### Keep your Aternos server alive 24/7.
### Please star this project <3
<br/>



# Requirements 🎒
1. A Repl.IT account.  
	Sign up at: https://replit.com/signup

2. An UptimeRobot account.  
	Sign up at: https://uptimerobot.com/signUp

3. A Minecraft server you owned.  
	Make sure your server settings ``online-mode`` set to ``false``!  
	And you should have the OP permission!



# Setup ⚙
1. Join your server first.
2. Build a bedrock room somewhere and stay in there.  
(Recommended room size: `X5 Y3 Z5`)
3. Go to [Repl It](https://replit.com/).
4. Click `+` in the top right and click `Import from GitHub` at the close button.
5. Put `https://github.com/JadeMin/aterbot.git` into `GitHub URL` and click `Create Repl`!
6. Click `Run` at the top then your bot will join your server.  
7. **Then teleport them into the bedrock room and change the gamemode to `Creative` to not die.**
8. You'll see the `Webview` tab on your Repl, then copy the url.
10. Go to [UptimeRobot](https://uptimerobot.com/dashboard).
11. Click `Add New Monitor` and select `Monitor Type` to `HTTP(s)`.
12. Paste the url copied in `Step 8` into `URL (or IP)`.
13. Click `Create Monitor` 2 times.
14. Finally... DONE! Enjoy your free 24/7 Aternos server.



# FAQ ❓
> #### Q1: My bot leaves immediately when I close the Repl page.
<details><summary>A1:</summary>

Repl projects are automatically turned off by closing it or inactive in every 5 minutes.  
And UptimeRobot trying to wake it up in every 5 minutes so you can just leave it even if not working for a while.
</details>

<hr/>

> #### Q2: How to fix `unsupported/unknown protocol version: ###, update minecraft-data`?
<details><summary>A2:</summary>

This project is using the mineflayer module and **it may not supported on your server version yet.**  
I'm trying to periodically check for updates, so please be patient.
</details>

<hr/>

> #### Q3: How to fix `Invalid move player packet received`?
<details><summary>A3:</summary>

It seems your bot escaped from your bedrock room, so they're in invalid location or moving to that.  
First you have to wipe the bot's playerdata in your server.  
1. Go to the management page of your Aternos server.
2. Click `Files` in the left section.
3. Delete the `world/playerdata/<UUID>.dat` and `<same>.dat_old` file that points the bot username.

**After it, lock the bot immediately as soon as possible!**  
**And change the bot's gamemode to `Creative` to not die.**
</details>

<hr/>

> #### Q4: My bot leaves permanently after n hours.
<details><summary>A4:</summary>

I'm not sure, but Aternos added a feature to their servers that **auto-ban players who playing too long.**  
So just unban them if banned.
</details>



# CAUTION ⚠
### Aternos might detect your suspicious actions and can delete your account!  
**By using this, you acknowledge that you're responsible for any problems arise.**  
**I DO NOT RECOMMEND DOING THIS ON YOUR MAIN ATERNOS SERVER!**