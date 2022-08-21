const { SlashCommandBuilder } = require('@discordjs/builders');
const { Question, writeQuestionsToFile } = require('../midori-quiz');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removequestion')
		.setDescription('Removes questions from the quiz')
		
		


		.addStringOption((option) =>
			option.setName('question').setDescription('Please Enter Question ID#').setRequired(true),
		

	
		), 
	async execute(interaction) {
		const quiz = require('../questions/quiz.json');

		const question = interaction.options.getString('question');
		

		console.log('The Following question has been removed from the quiz!');
		console.log(quiz[question]);
	
		delete quiz[question];
	//console.log(question);
	//console.log(quiz);
	
	interaction.reply('Question has been deleted. \n \nCheck console log for details ');

		writeQuestionsToFile(quiz,'quiz.json');
		
		// show question in log
		//console.log(quiz, 'quiz.json')
	
	},
};
