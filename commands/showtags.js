const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showalltags')
		.setDescription('shows all tags!'),
	async execute(interaction) {
		const tagList = await interaction.client.Tags.findAll({ attributes: ['name'] });
		const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

		return interaction.reply({
			content: `List of tags: ${tagString}`,
			ephemeral: true,
		});
	},
};