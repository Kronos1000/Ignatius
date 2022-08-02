const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setquizchannel')
		.setDescription('configures a channel to be used for Midori quizzing.')
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('please select the desired channel.')
				.setRequired(true),
		),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const tagName = `${interaction.guildId}.quizchannel`;

		try {
			await interaction.client.Tags.upsert({
				name: tagName,
				description: channel.id,
				username: interaction.user.username,
			});
			return interaction.reply(`Quiz will be run in ${channel.toString()}`);
		}
		catch (error) {
			return interaction.reply('Something went wrong with adding a channel.');
		}
	},
};
