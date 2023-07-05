const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js')
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const fetch = require('node-fetch')
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('memegen')
		.setDescription('Sends a random meme'),
	async execute(interaction) {
		let url = "https://meme-api.com/gimme";
		let settings = { method: "Get" };
		fetch(url, settings)
			.then(res => res.json())
			.then((json) => {
				interaction.reply(json.preview[json.preview.length-1])
		});
	},
};