const { SlashCommandBuilder } = require('@discordjs/builders');
const { Question, writeQuestionsToFile } = require('../midori-quiz');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addquestion')
		.setDescription('Adds a new question to the quiz.')

		.addIntegerOption((option) =>
		option.setName('subject').setDescription('Enter PaperID#').setRequired(true),
	)
		.addStringOption((option) =>
			option.setName('question').setDescription('What is your question?').setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('answerone').setDescription('The first answer to be shown').setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('answertwo').setDescription('The second answer to be shown').setRequired(true),
		)
		.addStringOption((option) =>
			option.setName('answerthree').setDescription('The third answer to be shown').setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName('correctanswer').setDescription('The correct number').setRequired(true).setMinValue(1).setMaxValue(3),
		),
	
	async execute(interaction) {
		const quiz = require('../questions/quiz.json');
		
		const subject = interaction.options.getInteger('subject');
		const question = interaction.options.getString('question');
		const a1 = interaction.options.getString('answerone');
		const a2 = interaction.options.getString('answertwo');
		const a3 = interaction.options.getString('answerthree');
		
		const correctAnswerINT = interaction.options.getInteger('correctanswer');
	
		let correctAnswerIs;

		switch (correctAnswerINT) {
		case 1:
			correctAnswerIs = '1️⃣';
			break;
		case 2:
			correctAnswerIs = '2️⃣';
			break;
		case 3:
			correctAnswerIs = '3️⃣';
			break;
		}

		const newQ = new Question(subject,question, a1, a2, a3, correctAnswerIs);
		quiz.push(newQ);
		writeQuestionsToFile(quiz, 'quiz.json');
		
		interaction.reply("Question has been added to the Question bank ");
		
		
		// console.log("There are currently " +keyCount +  " questions in the quiz bank.");
		
		
		console.log("The Following question has been added to question Bank:  \n " + "Subject: " + subject 
		 +"\nxQuestion: " + question 
		 +  "\nAnswer ONE: " + a1 
		 +"\nAnswer TWO: " + a2
		+ "\nAnswer Three: " + a3 
		+"\n Correct Answer: " +correctAnswerIs
		   ); 
	},
};
