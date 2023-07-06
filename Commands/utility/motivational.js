const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const Quotes = require('../../quotes.json')
function EmbedMsg(interaction, msg,author){
	const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(interaction.commandName)
            .setDescription(`${msg} \n  \n **${author}**`)
            .setFooter({ text: `${interaction.member.displayName}`});
        interaction.reply({ embeds: [exampleEmbed] });
}	
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('motivational')
		.setDescription('Sends a motivational quotes to a chat server'),
	async execute(interaction) {
        let randomInt = null
		randomInt = Math.floor(Math.random() * Quotes.quotes.length);
		EmbedMsg(interaction,Quotes.quotes[randomInt].quote,Quotes.quotes[randomInt].author)
	},
};