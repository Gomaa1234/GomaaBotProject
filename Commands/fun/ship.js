const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const wait = require('node:timers/promises').setTimeout;
const { Position } = require('../../imagePosition.json');
async function URLimg(url, time){
	// Get image Buffer from url and convert to Base64
    const image = await axios.get(url, {responseType: 'arraybuffer'});
    const base64Image = Buffer.from(image.data).toString('base64');
    // Do stuff with result...
	const end = Date.now();
	console.log(`Execution time: ${end - time} ms`);
	return base64Image;
}
function getColorId(colorArray, num){
	let valPercentage = 100/colorArray.length;
	let valConst = 0;
	for(i = 0; i<colorArray.length; i++){
		if(num > valConst+valPercentage){
			valConst += valPercentage;
		}
		else{
			return i
		}
	} 
}
async function compositeImages(img1, img2, backImg, dir, t, num) {
	try {
		const randomInt = Math.floor(Math.random() * 3);
		const width = 1024;
		const height = 512;
		const color = ["#ff3300", "#ff9900", "#ffff00", "#66ff33", "#33cc33"];
		const i = getColorId(color,num)
		const svgImage = `
			<svg width="${width}" height="${height}">
				<style>
				.title { 
					fill: ${color[i]};
					font-size: 100px; 
					font-family: Arial, sans-serif; 
					font-weight: normal;
					paint-order: stroke;
					stroke: #000000;
					stroke-width: 8px;
					stroke-linecap: butt;
					stroke-linejoin: miter;
				}
				</style>
				<text x="50%" y="80%" text-anchor="middle" class="title">${num}%</text>
			</svg>
		`;
		const svgBuffer = Buffer.from(svgImage);
		let img1Buffer = Buffer.from(img1, 'base64');
		let img2Buffer = Buffer.from(img2, 'base64');
		img1Buffer = await sharp(img1Buffer)
			.resize({ width: Position[randomInt].width })
			.toBuffer()
		img2Buffer = await sharp(img2Buffer)
			.resize({ width: Position[randomInt].width })
			.toBuffer()
		await sharp(backImg)
		.composite([
			{
				input: img1Buffer,
				top: Position[randomInt].y1,
				left: Position[randomInt].x1,
			},
			{
				input: img2Buffer,
				top: Position[randomInt].y2,
				left: Position[randomInt].x2,
			},
			{
				input: `./img/img-temple/${randomInt+1}.png`,
				top: 0,
				left: 0,
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
		if(!fs.existsSync(`./img/${interaction.guild.id}temp`))
			fs.mkdirSync(`./img/${interaction.guild.id}temp`)
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
			'./img/back-img.png' , 
			`./img/${interaction.guild.id}temp`, 
			start, 
			Math.floor(Math.random() * 101))
		await wait(100);
		interaction.reply({files: [`./img/${interaction.guild.id}temp/out.png`]})
	},
};