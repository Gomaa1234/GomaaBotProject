const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const {clientNewsApi} = require('../../config.json')
const NewsAPI = require('newsapi');
function EmbedMsg(interaction, json){
	const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(json.title)
			.setURL(json.url)
            .setDescription(json.description)
			.addFields({ name: 'news', value: json.content})
			.setImage(json.urlToImage)
            .setFooter({ text: json.source.name});
			interaction.channel.send({ embeds: [exampleEmbed] });
		}	
			
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('dailynews')
		.setDescription('Sends a news to a chat server')
		.addStringOption(option =>option.setName('input').setDescription('Add Quote')),
	async execute(interaction) {
		const maxNews = 5;
		const input = interaction.options.getString('input');
        if(!input) return error.execute(interaction,`You need to add a text to the command`);
        if (!interaction.channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.KickMembers)) return interaction.reply(`You don't have permissions to use this command`)
		const newsapi = new NewsAPI(clientNewsApi)
		newsapi.v2.everything({
			q: input,
			language: 'en',
			sortBy: 'Relevant',
		}).then(response => {
			if(response.articles.length >= maxNews){
				for(i = 0; i<maxNews;i++){
					EmbedMsg(interaction,response.articles[i])
				}
				interaction.deferReply();
				interaction.deleteReply();
			}else{
				for(i = 0; i<response.articles.length;i++){
					EmbedMsg(interaction,response.articles[i])
				}
				interaction.deferReply();
				interaction.deleteReply();
			}
		});
	},
};