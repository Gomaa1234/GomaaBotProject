const { SlashCommandBuilder } = require('discord.js');
const request = require('request');
const fs = require('fs');
const sharp = require('sharp');
const { open, rm } = require('fs/promises');
const wait = require('node:timers/promises').setTimeout;
const download = (url, path, callback) => {
	request.head(url, () => {
		request(url)
			.pipe(fs.createWriteStream(path))
			.on('close', callback);
	});
};

function del(filePath){
    fs.open(filePath, 'r+', function(err, fd){
        if (err && err.code === 'EBUSY'){
            //do nothing till next loop
        } else if (err && err.code === 'ENOENT'){
            console.log(filePath, 'deleted');
            clearInterval(delInterval);
        } else {
            fs.close(fd, function(){
                fs.unlink(filePath, function(err){
                    if(err){
                    } else {
                    console.log(filePath, 'deleted');
                    clearInterval(delInterval);
                    }
                });
            });
        }
    });
}
async function compositeImages(img1, img2, backImg) {
	try {
	await sharp(backImg)
		.composite([
			{
				input: img1,
				top: 0,
				left: 0,
			},
			{
				input: img2,
				top: 0,
				left: 256,
			},
		])
		.toFile("./img-temp/out.jpg")
	} catch (error) {
	  console.log(error);
	}
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ship')
		.setDescription('This command show the percentage of the ship of two peaple.')
		.addUserOption(option1 => option1.setName('target1').setDescription('The user\'s avatar to show').setRequired(true))
		.addUserOption(option2 => option2.setName('target2').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user1 = interaction.options.getUser('target1');
		const user2 = interaction.options.getUser('target2');
		const urlImgUser1 = `${user1.displayAvatarURL({ dynamic: true, format: 'png', size: 256 })}`;
		const pathImgUser1 = `img-temp/${user1.id}temp.png`
		const user1Img = await open(`./img-temp/${user1.id}temp.png`,'r');
		await download(urlImgUser1, pathImgUser1, () => {
			console.log('✅ Done!')
		})
		await wait(500);
		if(user2){
			const urlImgUser2 = `${user2.displayAvatarURL({ dynamic: true, format: 'png', size: 256 })}`
			const pathImgUser2 = `img-temp/${user2.id}temp.png`
 			await download(urlImgUser2, pathImgUser2, () => {
				console.log('✅ Done!')
			})
			await wait(500);
			const user2Img = await open(`./img-temp/${user1.id}temp.png`,'r');
			await open(`./img-temp/back-img.png`,'r');
			await compositeImages(`./${pathImgUser1}`,`./${pathImgUser2}`,`./img-temp/back-img.png`)
			setInterval(del(pathImgUser2), 1000);
		}
		setInterval(del(pathImgUser1), 1000);
	},
};