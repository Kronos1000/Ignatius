const { SlashCommandBuilder } = require('@discordjs/builders');
//const { Question, writeQuestionsToFile } = require('../midori-quiz');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('testing')
		.setDescription('Test that Ingatius  is operational by sending a message to the console'),
		
		

	async execute(interaction) {
		const quiz = require('../questions/quiz.json');
		//console.log(quiz)
		console.log("Ignatius is fully operational");
	await interaction.reply("Ignatius is fully operational");


	
	},
};
