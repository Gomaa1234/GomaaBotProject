const { SlashCommandBuilder } = require('discord.js');
// const request = require('request');
const axios = require('axios')
const fs = require('fs');
const sharp = require('sharp');
const wait = require('node:timers/promises').setTimeout;
async function URLimg(url, time){
	// Get image Buffer from url and convert to Base64
    const image = await axios.get(url, {responseType: 'arraybuffer'});
    const base64Image = Buffer.from(image.data).toString('base64');
    // Do stuff with result...
    console.log(base64Image);
	const end = Date.now();
	console.log(`Execution time: ${end - time} ms`);
	return base64Image
}
async function compositeImages(img1, img2, backImg, dir, t, text) {
	try {
		const width = 1024;
		const height = 512; 
		let i = null
		if(text <= 20)
			i = 0;
		else if(text <= 40)
			i = 1;
		else if(text <= 60)
			i = 2;
		else if(text <= 80)
			i = 3
		else if(text <= 100)
			i = 4
		const color = ["#ff3300", "#ff9900", "#ffff00", "#66ff33", "#33cc33"]
		const svgImage = `
			<svg width="${width}" height="${height}">
				<style>
				.title { 
					fill: ${color[i]}; 
					font-size: 100px; 
					font-family: Arial, sans-serif; 
					font-weight: normal;
				}
				</style>
				<text x="50%" y="80%" text-anchor="middle" class="title">${text}%</text>
			</svg>
		`;
		const svgBuffer = Buffer.from(svgImage);
		const img1Buffer = Buffer.from(img1, 'base64');
		const img2Buffer = Buffer.from(img2, 'base64');
		await sharp(backImg)
		.composite([
			{
				input: img1Buffer,
				top: 0,
				left: 0,
			},
			{
				input: img2Buffer,
				top: 0,
				left: 256,
			},
			{
				input: svgBuffer,
				top: 0,
				left: 0,
			},
		])
		.toFile(`${dir}/out.png`, () =>{
			const end = Date.now();
			console.log(`Execution time: ${end - t} ms ${dir}/out.png`);
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
		let urlImgUser1 = null;
		let urlImgUser2 = null;
		urlImgUser1 = `${user1.displayAvatarURL({ dynamic: true, format: 'png', size: 256})}`;
		if(!fs.existsSync(`./img-temp/${interaction.guild.id}temp`))
			fs.mkdirSync(`./img-temp/${interaction.guild.id}temp`)
		if(!user2){
		}else{
			urlImgUser2 = `${user2.displayAvatarURL({ dynamic: true, format: 'png', size: 256})}`;
		}
		start = Date.now();
		const imgUrl1 = await URLimg(urlImgUser1, start)
		start = Date.now();
		const imgUrl2 = await URLimg(urlImgUser2, start)
		start = Date.now();
		await compositeImages(
			imgUrl1, 
			imgUrl2, 
			'./img-temp/back-img.png' , 
			`./img-temp/${interaction.guild.id}temp`, 
			start, 
			Math.floor(Math.random() * 101))
		await wait(100);
		interaction.reply({files: [`./img-temp/${interaction.guild.id}temp/out.png`]})
	},
};