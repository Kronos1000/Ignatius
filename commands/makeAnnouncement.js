const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('makeannouncement')
		.setDescription('Simulates an announcement to the servers Announcement channel')
		.addStringOption((option) =>
			option.setName('announcement').setDescription('Enter ID.').setRequired(true),
		),
	async execute(interaction) {
		const announcementChannelTag = await interaction.client.Tags.findOne({ where: { name: `${interaction.guildId}.announcementchannel` } });

		if (!announcementChannelTag) {
			interaction.reply({
				content: 'No announcement channel has been configured. Please use /setannouncementchannel.',
				ephemeral: true,
			});
			return;
		}

		interaction.guild.channels.cache.get(`${announcementChannelTag.get('description')}`).send(interaction.options.getString('announcement'));

		interaction.reply({
			content: 'Announcement sent!',
			ephemeral: true,
		});
	},
};
