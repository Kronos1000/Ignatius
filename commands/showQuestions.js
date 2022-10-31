const { SlashCommandBuilder } = require('@discordjs/builders');
const { Question, writeQuestionsToFile } = require('../midori-quiz');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showquestions')
		.setDescription('show all questions currently in quiz bank '),
		
		

	async execute(interaction) {
		const quiz = require('../questions/quiz.json');
		//console.log(quiz)
		var keyCount  = Object.keys(quiz).length;
		console.log("There are currently " +keyCount +  " questions in the quiz bank.");
		const info = JSON.stringify((quiz));
		const words = "words";
console.log(quiz);
	await interaction.reply("Check System Log for details");


	
	},
};
