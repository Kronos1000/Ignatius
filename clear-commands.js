// Used to register an empty command list to clear all commands.

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);
(async () => {
	try {
		await rest.put(Routes.applicationCommands(clientId), { body: commands });

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});

		console.log('Submitted empty commands.');
	}
	catch (error) {
		console.error(error);
	}
})();
