const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		// info about the command like Name, Description, etc.
		.setName('server')
		.setDescription('Display info about this server.'),
	async execute(interaction) {
		// sends info about the server
		return interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};