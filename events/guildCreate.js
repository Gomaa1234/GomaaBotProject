const { REST, Routes } = require('discord.js');
const { ClientId, Token } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');
// when the bot is connected to a server the bot adds all commands to the server.
module.exports = {
	name: 'guildCreate',
	async execute(client, guild) {
		const commands = [];
        // Grab all the command folders from the commands directory you created earlier
        const foldersPath = path.join(__dirname, '../Commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory you created earlier
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
                else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(Token);

        // and deploy your commands!
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(ClientId, guild.id),
                    { body: commands },
                );
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
                const addition = {
                    guildId: `${guild.id}`,
                }
                fs.readFile("./config.json", "utf8", function readFileCallback(err, data) {
                    if (err) {
                      console.log(err);
                    } else {
                      var obj = JSON.parse(data); //now converting it to an object
                      obj.Guilds.push(addition); //adding the data
                      var json = JSON.stringify(obj, null, 2); //converting it back to json
                      fs.writeFile("./config.json", json, "utf8", (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("Done");
                        }
                      });
                    }
                  });
            }
            catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
    },
};