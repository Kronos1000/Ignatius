const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setannouncementschannel')
		.setDescription('configures a channel to be used for Midori announcements.')
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('please select the desired channel.')
				.setRequired(true),
		),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const tagName = `${interaction.guildId}.announcementchannel`;

		try {
			await interaction.client.Tags.upsert({
				name: tagName,
				description: channel.id,
				username: interaction.user.username,
			});
			return interaction.reply(`Announcements will be sent to ${channel.toString()}`);
		}
		catch (error) {
			return interaction.reply('Something went wrong with adding a channel.');
		}
	},
};
