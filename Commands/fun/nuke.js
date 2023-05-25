const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nuke')
		.setDescription('countdown command and clear the chat 10 msg'),
	async execute(interaction) {
		await interaction.reply('nuke');
		await wait(1000);
		for (let i = 1; i <= 10; i++) {
			await interaction.editReply(`${i}`);
			await wait(1000);
		}
		await interaction.editReply('https://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831');
	},
};