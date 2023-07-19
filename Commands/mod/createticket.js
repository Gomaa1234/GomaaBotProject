const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const message = require('../../EmbedMessages/Message.js')
const error = require('../../EmbedMessages/Error.js')
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
                let channelExist = false
                for(i = 0; i<file.ServerTicketClientId.length; i++){
                    if(file.ServerTicketClientId[i] == interaction.member.id){
                        error.execute(interaction,'This command had a error while executing. \n Please try later. ') 
                        channelExist = true
                        break;
                    }
                }
                if(!channelExist){
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
                        file.ServerTicketClientId.push(`${interaction.member.id}`);
                        var json = JSON.stringify(file, null);
                        fs.writeFile(pathJson, json, 'utf8', function (err) {
                            console.log("JSON file has been saved.");
                        });
                    }catch(err){
                        error.execute(interaction,'This command had a error while executing. \n Please try later. ')
                    }
                }
            })
        }
	},
};