const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
const JSONPath = "../../Servers"
const fs = require('fs');
const path = require('node:path');
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
                if(interaction.guild.channels.exists('name', `${interaction.member.displayName}-Private-Channel`)){
                    try{
                        guild.channels.create({
                            name: `${interaction.member.displayName}-Private-Channel`,
                            type: ChannelType.GuildText,
                            parent: parentTicket,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                               },
                            ]
                        });
                        message.execute(interaction,'The channel has created successfully')
                    }catch(err){
                        error.execute(interaction,'This command had a error while executing. \n Please try later. ')
                    }
                }else
                {
                    error.execute(interaction,'This Channel Already exist sorry.')
                }
            })
        }
	},
};