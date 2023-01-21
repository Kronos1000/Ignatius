const { SlashCommandBuilder } = require('@discordjs/builders');
const { Question, writeQuestionsToFile } = require('../midori-quiz');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('count')
		.setDescription('Returns the number of questions currently in the question bank '),
		
		

	async execute(interaction) {
		const quiz = require('../questions/quiz.json');
		console.log("Question Count: " +quiz.length)
		var keyCount  = quiz.length

		const info = JSON.stringify((quiz));
		const words = "words";

	await interaction.reply("Question Count: " +quiz.length);


	
	},
};
