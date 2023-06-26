const { SlashCommandBuilder } = require('discord.js');
const JSONPath = './Servers/';
const fs = require('fs');
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('funquotes')
		.setDescription('Sends a fun quote tu the user'),
	async execute(interaction) {
		fs.readFile(`${JSONPath+interaction.guildId}.json`, async (err, fileData) => {
			let file = JSON.parse(fileData);
			randomInt = Math.floor(Math.random() * file.FunQuotes.length);
			return interaction.reply(file.FunQuotes[randomInt])
		})
	},
};