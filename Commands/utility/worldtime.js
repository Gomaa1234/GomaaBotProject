const { SlashCommandBuilder } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('worldtime')
		.setDescription('Sends a Time of une country and a other meme'),
	async execute(interaction) {
        
	},
};