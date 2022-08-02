const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const midoriLib = require('../midoriLib');
const midoriLogoURL1 =
  'https://lh3.googleusercontent.com/pw/AM-JKLWVWXcX0XEGjZ3rrZPU_IsoDkSipjT9zZOtY1unbPyAozJmXq5BLWaknAEOb-BKd2cQojFDDEVrikA5yBPPvqOJWns3cqoD8Lput3dGCOebeJZNEdSNDylvKXbMZ1lh0L0_pyN5Zg8wYPsZYY03i4J-=s600-no?authuser=0';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('create emebedded reply ')
		.addStringOption((option) =>
			option.setName('input').setDescription('Enter ID.').setRequired(true),
		),
	async execute(interaction) {
	// Use the midorilib function to get from Azure. Submits Users as users are desired. This is returned as a parsed JSON object, not a string.
	const returnedString = await midoriLib
	.getAzure('UserObjects')
	.catch(midoriLib.handleError);

// Finds the element in the JSON object that matches our given student ID.
// eslint-disable-next-line no-unused-vars
const studentId = interaction.options.getString('input')
const s = await returnedString[returnedString.findIndex((record) => {return record.objectType === 'CalendarEntry';})];

		if (s == 'error') {
			await interaction.reply('Whoops that StudentID# is invalid ');
		}
		console.log(s);
		// else if (s.message.senderFirstName == 'string') {
		// 	const exampleEmbed = new MessageEmbed()
		// 		.setColor('#3EDE0A')
		// 		.setTitle('Student Information')
		// 		.setAuthor({
		// 			name: 'Midori',
		// 			iconURL: midoriLogoURL1,
		// 			url: midoriLogoURL1,
		// 		})
		// 		.setThumbnail(midoriLogoURL1)

		// 	// note for patrick:  Anything written that is placed within the name section will be bold.
		// 	// everything written in the value section will be regular
		// 		.addFields(
		// 			{
		// 				name: 'There are no new announcements right now',
		// 				value: `Try Again Later`,
		// 			},

				
		// 		)
		// 		.setTimestamp()
		// 		.setFooter({ text: 'Created by Midori', iconURL: midoriLogoURL1 });

		// 	await interaction.reply({ embeds: [exampleEmbed] });
		// }

		// // if sneder name != string display message sender details and content
		// else {
		// 	const exampleEmbed = new MessageEmbed()
		// 		.setColor('#3EDE0A')
		// 		.setTitle('Student Announcement')
		// 		.setAuthor({
		// 			name: 'Midori',
		// 			iconURL: midoriLogoURL1,
		// 			url: midoriLogoURL1,
		// 		})
		// 		.setThumbnail(midoriLogoURL1)

		// 	// note for patrick:  Anything written that is placed within the name section will be bold.
		// 	// everything written in the value section will be regular
		// 		.addFields(
		// 			{
		// 				name: 'ITC 601 Project management',
		// 				value: `${s.message.senderTitle} ${s.message.senderFirstName}  
		// 				${s.message.senderLastName} \n ${s.message.messageContent}`,
		// 			},

					
		// 		)
		// 		.setTimestamp()
		// 		.setFooter({ text: 'Created by Midori', iconURL: midoriLogoURL1 });

		// 	await interaction.reply({ embeds: [exampleEmbed] });
		await interaction.reply('Worked');
		
	},
};
