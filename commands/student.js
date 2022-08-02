const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const midoriLib = require('../midoriLib');
const midoriLogoURL1 =
  'https://lh3.googleusercontent.com/pw/AM-JKLWVWXcX0XEGjZ3rrZPU_IsoDkSipjT9zZOtY1unbPyAozJmXq5BLWaknAEOb-BKd2cQojFDDEVrikA5yBPPvqOJWns3cqoD8Lput3dGCOebeJZNEdSNDylvKXbMZ1lh0L0_pyN5Zg8wYPsZYY03i4J-=s600-no?authuser=0';

module.exports = {
	/* The following code builds the command and requires a student id be provided as a string */
	data: new SlashCommandBuilder()
		.setName('student')
		.setDescription('Enter Student ID# To return information')
		.addStringOption((option) =>
			option.setName('input').setDescription('Enter ID.').setRequired(true),
		),

	/* The following code is executed when the interaction is called */
	async execute(interaction) {
		await interaction.deferReply({ ephemral: true });
		const studentId = interaction.options.getString('input');

		// Use the midorilib function to get from Azure. Submits Users as users are desired. This is returned as a parsed JSON object, not a string.
		const returnedString = await midoriLib
			.getAzure('Users')
			.catch(midoriLib.handleError);

		// Finds the element in the JSON object that matches our given student ID.
		// eslint-disable-next-line no-unused-vars
		const s = await returnedString[returnedString.findIndex((record) => {return record.userId === studentId;})];

		if (!s) {

			interaction.editReply({
				content: `Could not find Student #${studentId}. Please try again.`,
				ephemeral: true,
			});

			return;
		}
		// Builds an embed. Some fields from the original embed have been removed as the API does not return the values.
		const reply = new MessageEmbed()
			.setColor('#3EDE0A')
			.setTitle('Student Information')
			.setAuthor({
				name: 'Midori',
				iconURL: midoriLogoURL1,
				url: midoriLogoURL1,
			})
			.setThumbnail(midoriLogoURL1)

			.addFields([
				{
					name: 'Student Name:',
					value: `${s.title} ${s.firstname} ${s.lastname} \n `,
				},

				{
					name: 'StudentID:',
					value: s.userId,
					inline: false,
				},

				// {
				// 	name: 'Mobile Number:',
				// 	value: s.m_phone || 'Unspecified',
				// 	inline: true,
				// },

				{
					name: 'Email Address:',
					value: s.inst_email || 'Unspecified',
					inline: true,
				},

		
			])
			.setTimestamp()
			.setFooter({ text: 'Created by Midori', iconURL: midoriLogoURL1 });
if (s.pronouns)	{	
		reply.addField('Gender Pronouns:',s.pronouns)}
		await interaction.editReply({ embeds: [reply] });
	},
};