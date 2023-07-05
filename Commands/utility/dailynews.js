const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const {clientNewsApi} = require('../../config.json')
const NewsAPI = require('newsapi');
function EmbedMsg(interaction, des, arr1, arr2, arr3, arr4, arr5){
	const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(interaction.commandName)
            .setDescription(des)
			.addFields(
				{ name: 'Regular field title', url: "https://lifehacker.com/this-refurbished-mac-mini-is-on-sale-for-206-1850572072", value: 'Some value here' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
            .setFooter({ text: `${interaction.member.displayName}`});
        interaction.reply({ embeds: [exampleEmbed] });
}	
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('dailynews')
		.setDescription('Sends a news to a chat server')
		.addStringOption(option =>option.setName('input').setDescription('Add Quote')),
	async execute(interaction) {
		const input = interaction.options.getString('input');
        if(!input) return error.execute(interaction,`You need to add a text to the command`);
        if (!interaction.channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.KickMembers)) return interaction.reply(`You don't have permissions to use this command`)
		const newsapi = new NewsAPI(clientNewsApi)
		newsapi.v2.everything({
			q: input,
			language: 'en',
			sortBy: 'popularity',
		}).then(response => {
			const maxNews = 5;
			if(response.articles.length >= maxNews)
			for(i = 0; i<maxNews;i++){
				console.log(response.articles[i]);
				return EmbedMsg(interaction,'ola')
			}
			
		});
	},
};