const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const wait = require('node:timers/promises').setTimeout;
const { PositionShip } = require('../../imagePos.json');
const error = require('../../EmbedMessages/Error.js')
// this converts url to a base 64
async function URLimg(url) {
	// Get the image as a Buffer.
	const imageBuffer = await axios.get(url, {responseType: 'arraybuffer'});
  
	// Convert the Buffer to Base64.
	const base64Image = Buffer.from(imageBuffer).toString('base64');
  
	// Return the Base64 image.
	return base64Image;
  }
// this function return the index to a array  of color
const getColorId = (colorArray, num) => {
	// Get the ceiling of the percentage.
	const valPercentage = Math.ceil(100 / colorArray.length);
	// Initialize the current value.
	let valConst = 0;
  
	// Use the bisect.bisect_left() function to find the index of the element in the array that is closest to `num`.
	const index = bisect.bisect_left(colorArray, num);
  
	// If the index is equal to the length of the array, then return the index - 1.
	if (index === colorArray.length) {
	  return index - 1;
	} else if (num === colorArray[index]) {
	  // If the number is equal to the element at the index, then return the index.
	  return index;
	} else {
	  // Otherwise, return the index.
	  return index;
	}
};
const compositeImages = async (img1, img2, backImg, dir, t, num, interaction, user1, user2) => {
	// Random number 0 to number of images template.
	const path = `./img/img-temple/ship/`;
	let randomInt = null;
	await fs.readdir(path, (err, files) => {
	  randomInt = Math.floor(Math.random() * files.length);
	});
	await wait(10)
	const color = ["#FF0D0D", "#FF4E11", "#FF8E15", "#FAB733", "#ACB334", "#69B34C","#33CC33"];
	// gets color depending of the variable num.
	const i = getColorId(color,num)
	// Create a SVG image with text on it with color and variable num.
	const svgImage = `
	  <svg width="1024" height="512">
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
  
	// Create a buffer from the SVG image, img1Buffer and img2Buffer.
	const svgBuffer = Buffer.from(svgImage);
	const img1Buffer = Buffer.from(img1, 'base64');
	const img2Buffer = Buffer.from(img2, 'base64');
  
	// Resize the image size to the PositionShip[index].width.
	img1Buffer = await sharp(img1Buffer)
	  .resize({ width: PositionShip[randomInt].width })
	  .toBuffer();
	img2Buffer = await sharp(img2Buffer)
	  .resize({ width: PositionShip[randomInt].width })
	  .toBuffer();
  
	// Composite all images in the next order 1st img1Buffer, 2nd img2Buffer, 3rd image template and 4th svgBuffer.
	const compositedImage = sharp(backImg)
	  .composite([
		{
		  input: img1Buffer,
		  top: PositionShip[randomInt].y1,
		  left: PositionShip[randomInt].x1,
		},
		{
		  input: img2Buffer,
		  top: PositionShip[randomInt].y2,
		  left: PositionShip[randomInt].x2,
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
	  ]);
  
	// Save the composited image to a file.
	await compositedImage.toFile(`${dir}/out.png`);
  
	// Create an Embed object and send it to Discord.
	const fileImage = new AttachmentBuilder(`${dir}/out.png`);
	const exampleEmbed = new EmbedBuilder()
	  .setColor(0x0099FF)
	  .setTitle(interaction.commandName)
	  .setDescription(`${user1}❤️${user2}`)
	  .setImage('attachment://out.png')
	  .setFooter({ text: `${interaction.member.displayName}`});
	interaction.reply({ embeds: [exampleEmbed], files: [fileImage]});
  
	// Log the execution time.
	const end = Date.now();
	console.log(`Execution time: ${end - t} ms`);
};
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
		const timer = Date.now();
		// grabs all the options in the interaction.
		const user1 = interaction.options.getUser('1st-user');
		const user2 = interaction.options.getUser('2nd-user');
		if(user1===null || user2 === null) error.execute(interaction,`You need to add at least 2 people to use this command`)
		// this grabs the urls of the users profile pics
		const urlImgUser1 = `${user1.displayAvatarURL({ dynamic: true, format: 'png', size: 256})}`;
		const urlImgUser2 = `${user2.displayAvatarURL({ dynamic: true, format: 'png', size: 256})}`;
		// see is folder exist if not create folder with the server id + temp
		if(!fs.existsSync(`./img/serversImg/${interaction.guild.id}temp`))
			fs.mkdirSync(`./img/serversImg/${interaction.guild.id}temp`)
		// this grabs the return of the function.
		const imgUrl1 = await URLimg(urlImgUser1)
		const imgUrl2 = await URLimg(urlImgUser2)
		// this calls the compositeImage function
		await compositeImages(
			imgUrl1,
			imgUrl2,
			'./img/back-img.png',
			`./img/serversImg/${interaction.guild.id}temp`,
			timer,
			Math.floor(Math.random() * 101),
			interaction,
			user1, 
			user2
		)
	},
};