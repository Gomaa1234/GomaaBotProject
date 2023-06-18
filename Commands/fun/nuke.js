const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('nuke')
		.setDescription('countdown command and clear the chat 10 msg'),
	async execute(interaction) {
		// reply with nuke
		await interaction.reply('nuke');
		// wait 1000 milliseconds
		await wait(1000);
		for (let i = 1; i <= 10; i++) {
			// edit reply 
			await interaction.editReply(`${i} `);
			// wait another 1000 milliseconds
			await wait(1000);
		}
		// finally send a nuke gif
		await interaction.editReply('https://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831');
	},
};