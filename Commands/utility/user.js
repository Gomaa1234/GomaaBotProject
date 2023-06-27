const { SlashCommandBuilder } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// sends info about the user
		return message.execute(interaction,`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};