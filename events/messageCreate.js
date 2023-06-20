const badWord = require('../bad-words.json')
module.exports = {
	name: 'messageCreate',
	async execute(client,message) {
        let msg = message.content;
        msg = msg.toLowerCase();
        for(i = 0; i < badWord['word-bad'].length; i++){
            if(msg.search(badWord['word-bad'][i])){
                console.log('no');
                message.delete()
                    .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                    .catch(console.error);
                return;
            }
        }
        console.log(`message in`)
    }
}
