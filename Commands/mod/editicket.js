const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const fs = require('fs');
const path = require('node:path');
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('editticket')
		.setDescription('creates a Personal ticket in the server to the server.'),
	async execute(interaction) {

    }
}