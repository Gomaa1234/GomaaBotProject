const { SlashCommandBuilder } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('dailytopic')
		.setDescription('Sends a topic to a chat server'),
	async execute(interaction) {
        
	},
};