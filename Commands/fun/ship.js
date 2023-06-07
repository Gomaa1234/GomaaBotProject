const { SlashCommandBuilder } = require('discord.js');
const { ClientId} = require('../../config.json');
const sharp = require("sharp");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ship')
		.setDescription('This command show the percentage of the ship of two peaple.')
		.addUserOption(option1 => option1.setName('target1').setDescription('The user\'s avatar to show').setRequired(true))
		.addUserOption(option2 => option2.setName('target2').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user1 = interaction.options.getUser('target1');
		const user2 = interaction.options.getUser('target2');
		if (user2){
			async function getMetadata() {
				try {
					await sharp(`${user1.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 })}`)
					.resize({
					  width: 150,
					  height: 97
					})
					.toFormat("jpeg", { mozjpeg: true })
					.toFile("target1-resized-compressed.jpeg");
				} catch (error) {
					console.log(`An error occurred during processing: ${error}`);
				}
			}
			getMetadata();			  
		}
	},
};