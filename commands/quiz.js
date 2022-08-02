const { SlashCommandBuilder } = require('@discordjs/builders');
const midoriLib = require('../midoriLib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quiz')
		.setDescription('Starts/Stops quizzing'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (interaction.guild.quizJob) {
			interaction.guild.quizJob.stop();
			interaction.guild.quizJob = null;
			await interaction.client.Tags.destroy({ where: { name: `${interaction.guildId}.quizOn` } });
			return interaction.editReply('Quiz has been stopped.');
		}

		midoriLib.startQuiz(interaction.guild);
		interaction.guild.quizJob.start();


		await interaction.client.Tags.upsert({
			name: `${interaction.guildId}.quizOn`,
			description: 'true',
			username: interaction.user.username,
		});
		interaction.editReply('Quiz has started');

	},
};
