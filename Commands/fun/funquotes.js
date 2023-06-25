const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('funquotes')
		.setDescription('Sends a fun quote tu the user'),
	async execute(interaction) {
		await interaction.Reply('Test Quote: Never gonna give you up');
	},
};