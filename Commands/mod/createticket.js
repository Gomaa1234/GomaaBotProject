const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const JSONPath = "../../Servers"
const fs = require('fs');
const path = require('node:path');
var split = function (str) {
    return str.split('\\').pop().split('/').pop();
}
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, etc.
		.setName('createticket')
		.setDescription('creates a Personal ticket in the server to the server.'),
	async execute(interaction) {
        const guild = interaction.guild;
        const pathJson = path.resolve('Servers', `${interaction.guildId}.json`);
        if(fs.existsSync(pathJson)){
            fs.readFile(pathJson, async (err, fileData) => {
                let file = JSON.parse(fileData);
                let parentTicket = file.TicketCategory;
                guild.channels.create({
                    name: `${interaction.member.displayName}-Private-Channel`,
                    type: ChannelType.GuildText,
                    parent: parentTicket,
                });
            })
        }
	},
};