const { SlashCommandBuilder } = require('@discordjs/builders');
const { Question, writeQuestionsToFile } = require('../midori-quiz');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showquestions')
    .setDescription('show all questions currently in quiz bank '),

  async execute(interaction) {
    const quiz = require('../questions/quiz.json');
    const keyCount = Object.keys(quiz).length;
    console.log("There are currently " + keyCount + " questions in the quiz bank.");

    let currentMessage = 'The Quiz bank contains the following questions:\n';
    let index = 1;
    for (const question of Object.values(quiz)) {
      const questionText = question.question;
      const newLine = `${index}. ${questionText}\n`;
      const newMessage = currentMessage + newLine;

      if (newMessage.length <= 2000) {
        currentMessage = newMessage;
        index++;
      } else {
        await interaction.reply(currentMessage);
        currentMessage = newLine;
        index = 2;
      }
    }

    await interaction.reply(currentMessage);
console.log(quiz);
  },
};
