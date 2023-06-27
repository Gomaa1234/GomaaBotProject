const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('addquotes')
		.setDescription('Add Quotes to the server.')
        .addStringOption(option =>option.setName('input').setDescription('Add Quote')),
	async execute(interaction) {
        const quote = interaction.options.getString('input');
        if(quote===null) return error.execute(interaction,`You need to add a text to the command`);
        if (!interaction.channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.KickMembers)) return interaction.reply(`You don't have permissions to use this command`);
        const jsonData = `${quote}`;
        fs.readFile(`./Servers/${interaction.guildId}.json`, "utf8", function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                var obj = JSON.parse(data); //now converting it to an object
                for(i= 0; i < obj.FunQuotes.length; i++){
                    if(quote === obj.FunQuotes[i]){
                        return error.execute(interaction,`This Quote already was added`)
                    }
                }
                obj.FunQuotes.push(jsonData); //adding the data
                var json = JSON.stringify(obj, null, 2); //converting it back to json
                fs.writeFile(`./Servers/${interaction.guildId}.json`, json, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`${quote} was add successfully`);
                    message.execute(interaction,`**${quote}** was added successfully`)
                });
            }
        })
	},
};