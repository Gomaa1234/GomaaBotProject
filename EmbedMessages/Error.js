const { EmbedBuilder } = require('discord.js');
module.exports = {
    async execute(interaction,msg) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0xD42D2D)
            .setTitle(interaction.commandName)
            .setDescription(msg)
            .setFooter({ text: `${interaction.member.displayName}`});
        interaction.reply({ embeds: [exampleEmbed] });
    }
}