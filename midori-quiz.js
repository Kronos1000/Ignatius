const fs = require('fs');

class Question {

	constructor(question, a1, a2, a3, correctAnswerIs) {
		this.question = question;
		this.a1 = a1;
		this.a2 = a2;
		this.a3 = a3;
		this.correctAnswerIs = correctAnswerIs;
	}

	checkAnswer(answer) {
		if (!answer) {
			throw new Error('Answer must not be null, undefined or falsey.');
		}

		switch (this.correctAnswerIs) {

		case 1:
			if (answer === this.a1) return true;
			break;

		case 2:
			if (answer === this.a2) return true;
			break;

		case 3:
			if (answer === this.a3) return true;

		}
		return false;
	}
}

function readQuestionsFromFile(fileName) {
	const questionsString = fs.readFileSync(`./questions/${fileName}`);
	const questionsJSON = JSON.parse(questionsString);

	return questionsJSON;
}

function writeQuestionsToFile(questions, fileName) {
	fs.writeFileSync(`./questions/${fileName}`, JSON.stringify(questions, null, 2), 'utf-8');
}
module.exports = { Question, readQuestionsFromFile, writeQuestionsToFile };