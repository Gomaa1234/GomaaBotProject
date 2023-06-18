const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		// info about the command like Name, Description, etc.
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// sends a reply 
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		// edits the reply with the ping in milliseconds.
		interaction.editReply(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};