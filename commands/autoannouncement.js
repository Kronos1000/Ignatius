const { SlashCommandBuilder } = require('@discordjs/builders');
const midoriLib = require('../midoriLib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('automaticannouncements')
		.setDescription('Starts/Stops automatic announcements'),
	async execute(interaction) {
		await interaction.deferReply({ ephemral: true });

		if (interaction.guild.announcementJob) {
			interaction.guild.announcementJob.stop();
			interaction.guild.calendarJob.stop();

			interaction.guild.announcementJob = null;
			interaction.guild.calendarJob = null;

			await interaction.client.Tags.destroy({ where: { name: `${interaction.guildId}.autoAnnouncementOn` } });
			return interaction.editReply('Auto announcements have been stopped.');
		}

		midoriLib.startAutoAnnouncements(interaction.guild);
		interaction.guild.announcementJob.start();

		midoriLib.startAutoCalendar(interaction.guild);
		interaction.guild.calendarJob.start();

		await interaction.client.Tags.upsert({
			name: `${interaction.guildId}.autoAnnouncementOn`,
			description: 'true',
			username: interaction.user.username,
		});
		interaction.editReply('Automatic announcements have started');

	},
};
