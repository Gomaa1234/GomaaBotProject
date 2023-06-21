const badWord = require('../bad-words.json');
const JSONPath = './Servers/';
const fs = require('fs');
module.exports = {
	name: 'messageCreate',
	async execute(client,message) {
        let msg = message.content;
        msg = msg.toLowerCase();
        for(i = 0; i < badWord['word-bad'].length; i++){
            if(msg.search(badWord['word-bad'][i]) != -1){
                console.log('no');
                message.delete()
                    .then(msg => {
                        console.log(`Deleted message from ${msg.author.username}`);
                        fs.readFile(`${JSONPath+message.guildId}.json`, async (err, fileData) => {
                            if (err) throw err;
                            let file = JSON.parse(fileData);
                            client.channels.fetch(file.modChannel)
                            .then(channel => {
                                channel.send(`**Message send by <@${msg.author.id}> was deleted by This Bot in ${message.channel}**`);
                            })
                        })
                    })
                    .catch(console.error);
                return;
            }
        }
        console.log(`message in`)
    }
}
