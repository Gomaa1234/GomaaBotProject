const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
function EmbedMsg(interaction, msg,url){
	const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(interaction.commandName)
            .setDescription(msg)
			.setImage(url)
            .setFooter({ text: `${interaction.member.displayName}`});
        interaction.reply({ embeds: [exampleEmbed] });
}	
module.exports = {
	data: new SlashCommandBuilder()
		// info about the command like Name, Description, User Options, etc.
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		// gets user
		const user = interaction.options.getUser('target');
		// reply with the users avatar
		if (user) return EmbedMsg(interaction,`${user.username}'s avatar:`, user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }));
		return EmbedMsg(interaction,`Your Avatar:`,interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }))
	},
};