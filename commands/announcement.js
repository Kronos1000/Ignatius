const { SlashCommandBuilder } = require('@discordjs/builders');
const midoriLib = require('../midoriLib');
// const fs = require('fs');


module.exports = {
	/* The following code builds the command and requires a student id be provided as a string */
	data: new SlashCommandBuilder()
		.setName('announcement')
		.setDescription('Student Announcement')
		.addStringOption((option) =>
			option.setName('input').setDescription('Enter ID.').setRequired(true),
		),

	/* The following code is executed when the interaction is called */
	async execute(interaction) {
		await interaction.deferReply();
		const studentId = interaction.options.getString('input');

		// Use the midorilib function to get from Azure. Submits Users as users are desired. This is returned as a parsed JSON object, not a string.
		const returnedString = await midoriLib
			.getAzure('UserObjects')
			.catch(midoriLib.handleError);

		// Finds the element in the JSON object that matches our given student ID.
		// eslint-disable-next-line no-unused-vars
		const matches = returnedString.filter(record => record.userId === studentId && record.objectType === 'Announcement');

		const s = matches[0];

		if (!s) {

			interaction.editReply({
				content: `Could not find Student #${studentId}. Please try again.`,
				ephemeral: true,
			});

			return;
		}
		// Builds an embed. Some fields from the original embed have been removed as the API does not return the values.
		const reply = midoriLib.createAnnouncement(s);

		interaction.editReply({ embeds: [reply] });
		// fs.writeFile('test.json', JSON.stringify(returnedString), function(err) {
		// 	if (err) {
		// 		return console.log(err);
		// 	}
		// 	console.log('The file was saved!');
		// });
	},
};