const { EmbedBuilder } = require('discord.js');
module.exports = {
    async execute(interaction,msg) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(interaction.commandName)
            .setDescription(msg)
            .setFooter({ text: `${interaction.member.displayName}`});
        interaction.reply({ embeds: [exampleEmbed] });
    }
}