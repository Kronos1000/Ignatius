// Ready is triggered once, when the bot is initialized.
const midoriLib = require('../midoriLib');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		client.Tags.sync();
		client.guilds.cache.forEach(async (guild) => {
			try {
				const check = await guild.client.Tags.findOne({ where: { name: `${guild.id}.autoAnnouncementOn` } });
				if (check.get('description') === 'true') {
					midoriLib.startAutoAnnouncements(guild);
					midoriLib.startAutoCalendar(guild);
				}
			}

			catch {
				console.log();
			}

			try {
				const check = await guild.client.Tags.findOne({ where: { name: `${guild.id}.quizOn` } });
				if (check.get('description') === 'true') midoriLib.startQuiz(guild);
			}
			catch {
				console.log();
			}
		});
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
	},
};
