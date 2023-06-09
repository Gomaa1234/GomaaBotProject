const { SlashCommandBuilder } = require('discord.js');
const request = require('request');
const fs = require('fs');
const sharp = require('sharp');
const { open, rm, unlink } = require('fs/promises');
const wait = require('node:timers/promises').setTimeout;
const download = (url, path, callback) => {
	request.head(url, () => {
		request(url)
			.pipe(file = fs.createWriteStream(path))
			.on('close', callback);
	});
};

async function del(file,filePath){
	try {
		rm(filePath);
	}catch (error) {
		console.log(error);
	}
}
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
		.toFile("./img-temp/out.jpg",  async() =>{
			const end3 = Date.now();
			console.log(`Execution time: ${end3 - t} ms ./img-temp/out.jpg`);
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
		
		const user1 = interaction.options.getUser('target1');
		const user2 = interaction.options.getUser('target2');
		const urlImgUser1 = `${user1.displayAvatarURL({ dynamic: true, format: 'jpg', size: 256 })}`;
		let urlImgUser2 = null;
		const pathImgUser1 = `./img-temp/${user1.id}temp.jpg`;
		let pathImgUser2 = null;
		if(!user2){

		}else{
			urlImgUser2 = `${user2.displayAvatarURL({ dynamic: true, format: 'jpg', size: 256 })}`;
			pathImgUser2 = `./img-temp/${user2.id}temp.jpg`
		}
		const start1 = Date.now();
		await download (urlImgUser1, pathImgUser1, () =>{
			console.log("✅ Done1");
			const end1 = Date.now();
			console.log(`Execution time: ${end1 - start1} ms ${pathImgUser1}`);
		});
		const start2 = Date.now();
		await download (urlImgUser2, pathImgUser2, () =>{
			console.log("✅ Done2");
			const end2 = Date.now();
			console.log(`Execution time: ${end2 - start2} ms ${pathImgUser2}`);
		});
		await wait(1000);
		const start3 = Date.now();
		await compositeImages(pathImgUser1,pathImgUser2,'./img-temp/back-img.png',start3);
	},
};