const { SlashCommandBuilder } = require('discord.js');
const request = require('request');
const fs = require('fs');
const sharp = require('sharp');
const wait = require('node:timers/promises').setTimeout;
const download = (url, path, callback) => {
	request.head(url, () => {
		request(url)
			.pipe(file = fs.createWriteStream(path))
			.on('close', callback);
	});
};
async function compositeImages(img1, img2, backImg, t) {
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
		.toFile("./img-temp/out.jpg", () =>{
			const end = Date.now();
			console.log(`Execution time: ${end - t} ms ./img-temp/out.jpg`);
		})
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
		let start = null;
		const user1 = interaction.options.getUser('target1');
		const user2 = interaction.options.getUser('target2');
		let urlImgUser1 = `${user1.displayAvatarURL({ dynamic: true, format: 'jpg', size: 256 })}`;
		if(!fs.existsSync(`./img-temp/${interaction.guild.id}temp`))
			fs.mkdirSync(`./img-temp/${interaction.guild.id}temp`)
		let urlImgUser2 = null;
		let pathImgUser1 = `./img-temp/${interaction.guild.id}temp/${user1.id}temp.jpg`;
		let pathImgUser2 = null;
		if(!user2){
		}else{
			urlImgUser2 = `${user2.displayAvatarURL({ dynamic: true, format: 'jpg', size: 256 })}`;
			pathImgUser2 = `./img-temp/${interaction.guild.id}temp/${user2.id}temp.jpg`
		}
		start = Date.now();
		if(!fs.existsSync(pathImgUser1)){
			await download (urlImgUser1, pathImgUser1, () =>{
				console.log("✅ Done1");
				const end = Date.now();
				console.log(`Execution time: ${end - start} ms ${pathImgUser1}`);
			});
		}
		start = Date.now();
		if(!fs.existsSync(pathImgUser1)){
			await download (urlImgUser2, pathImgUser2, () =>{
				console.log("✅ Done2");
				const end = Date.now();
				console.log(`Execution time: ${end - start} ms ${pathImgUser2}`);
			});
		}
		await wait(500)
		start = Date.now();
		await compositeImages(pathImgUser1,pathImgUser2,'./img-temp/back-img.png',start);
	},
};