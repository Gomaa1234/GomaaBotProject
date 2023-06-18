const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		// info about the command like Name, Description, User Options, etc.
		.setName('kick')
		.setDescription('Select a member and kick them (but not really).')
		.addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true)),
	async execute(interaction) {
		// gets member and puts in a variable
		const member = interaction.options.getMember('target');
		// send a reply.
		return interaction.reply({ content: `You wanted to kick: ${member.user.username}`, ephemeral: true });
	},
};