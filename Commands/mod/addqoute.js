const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('addquotes')
		.setDescription('Add Quotes to the server.')
        .addStringOption(option =>option.setName('input').setDescription('Add Quote')),
	async execute(interaction) {
        const quote = interaction.options.getString('input');
        const jsonData = `${quote}`;
        fs.readFile(`./Servers/${interaction.guildId}.json`, "utf8", function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                var obj = JSON.parse(data); //now converting it to an object
                obj.FunQuotes.push(jsonData); //adding the data
                var json = JSON.stringify(obj, null, 2); //converting it back to json
                fs.writeFile(`./Servers/${interaction.guildId}.json`, json, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`${quote} was add successfully`);
                    interaction.reply(`**${quote}** was add successfully`)
                });
            }
        })
	},
};