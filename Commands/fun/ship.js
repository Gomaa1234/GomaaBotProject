const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const wait = require('node:timers/promises').setTimeout;
const { Position } = require('../../imagePos.json');
// this converts url to a base 64
async function URLimg(url, time){
	// get image Buffer from url and convert to Base64
    const image = await axios.get(url, {responseType: 'arraybuffer'});
    const base64Image = Buffer.from(image.data).toString('base64');
    // console log the time that take to finish
	const end = Date.now();
	console.log(`Execution time: ${end - time} ms`);
	// return base64 image
	return base64Image;
}
// this function return the index to a array  of color
function getColorId(colorArray, num){
	// this gets the percentage of array length divided by 100
	let valPercentage = 100/colorArray.length;
	// this variable serves do add percentage gradually.
	let valConst = 0;
	for(i = 0; i<colorArray.length; i++){
		// see is num is bigger than valConst plus valPercentage
		if(num > valConst+valPercentage){
			// adds valPercentage to valConst
			valConst += valPercentage;
		}
		else{
			// return index when false
			return i
		}
	} 
}
async function compositeImages(img1, img2, backImg, dir, t, num) {
	try {
		// random number 0 to number of images template.
		const path = `./img/img-temple/ship/`
		let randomInt = null
		fs.readdir(path, (err, files) => {
			randomInt = Math.floor(Math.random() * files.length);
		});
		await wait(10)
		const width = 1024;
		const height = 512;
		const color = ["#FF0D0D", "#FF4E11", "#FF8E15", "#FAB733", "#ACB334", "#69B34C","#33CC33"];
		// gets color depending of the variable num.
		const i = getColorId(color,num)
		// this create a svg image with text on it with color and variable num.
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
				<text x="50%" y="95%" text-anchor="middle" class="title">${num}%</text>
			</svg>
		`;
		// this create a buffer to from the svgImage, img1Buffer and img2Buffer.
		const svgBuffer = Buffer.from(svgImage);
		let img1Buffer = Buffer.from(img1, 'base64');
		let img2Buffer = Buffer.from(img2, 'base64');
		// this adjust the image size to the Position[index].width.
		img1Buffer = await sharp(img1Buffer)
			.resize({ width: Position[randomInt].width })
			.toBuffer()
		img2Buffer = await sharp(img2Buffer)
			.resize({ width: Position[randomInt].width })
			.toBuffer()
		// this composite all images in the next order 1st img1Buffer, 2nd img2Buffer, 3rd image template and 4th svgBuffer .
		sharp(backImg)
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
					input: `./img/img-temple/ship/${randomInt + 1}.png`,
					top: 0,
					left: 0,
				},
				{
					input: svgBuffer,
					top: 0,
					left: 0,
				},
			])
			// this makes a image created to file.
			.toFile(`${dir}/out.png`, () => {
				const end = Date.now();
				console.log(`Execution time: ${end - t} ms ${dir}/out.png`);
			})
	} catch (error) {
		console.log(error);
	}
}
module.exports = {
	data: new SlashCommandBuilder()
	// info about the command like Name, Description, User Options, etc.
		.setName('ship')
		.setDescription('This command show the percentage of the ship of two peaple.')
		.addUserOption(option1 => option1.setName('1st-user').setDescription('user number 1').setRequired(true))
		.addUserOption(option2 => option2.setName('2nd-user').setDescription('user number 2').setRequired(true)),
		// execute the code of the command.
	async execute(interaction) {
		// this is a variable to set a start time to the function to then see who many ms a function takes to finish.
		let start = null;
		// grabs all the options in the interaction.
		const user1 = interaction.options.getUser('1st-user');
		const user2 = interaction.options.getUser('2nd-user');
		// this grabs the urls of the users profile pics
		const urlImgUser1 = `${user1.displayAvatarURL({ dynamic: true, format: 'png', size: 256})}`;
		const urlImgUser2 = `${user2.displayAvatarURL({ dynamic: true, format: 'png', size: 256})}`;
		// see is folder exist if not create folder with the server id + temp
		if(!fs.existsSync(`./img/serversImg/${interaction.guild.id}temp`))
			fs.mkdirSync(`./img/serversImg/${interaction.guild.id}temp`)
		// start the timer for this function
		start = Date.now();
		// this grabs the return of the function.
		const imgUrl1 = await URLimg(urlImgUser1, start)
		start = Date.now();
		const imgUrl2 = await URLimg(urlImgUser2, start)
		start = Date.now();
		// this calls the compositeImage function
		await compositeImages(
			imgUrl1,
			imgUrl2,
			'./img/back-img.png',
			`./img/serversImg/${interaction.guild.id}temp`,
			start,
			Math.floor(Math.random() * 101))
		await wait(100);
		// reply to the interaction with the generated file.
		interaction.reply({files: [`./img/serversImg/${interaction.guild.id}temp/out.png`]})
	},
};