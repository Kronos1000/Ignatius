const cosmos = require('@azure/cosmos');
const CronJob = require('cron').CronJob;
const CosmosClient = cosmos.CosmosClient;
const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const midoriLogoURL1 =
	'https://lh3.googleusercontent.com/pw/AM-JKLWVWXcX0XEGjZ3rrZPU_IsoDkSipjT9zZOtY1unbPyAozJmXq5BLWaknAEOb-BKd2cQojFDDEVrikA5yBPPvqOJWns3cqoD8Lput3dGCOebeJZNEdSNDylvKXbMZ1lh0L0_pyN5Zg8wYPsZYY03i4J-=s600-no?authuser=0';


function getData(id) {
	let data;
	if (!fs.existsSync(`./data/${id}.json`)) {
		return 'error';
	}
	else { data = JSON.parse(fs.readFileSync(`./data/${id}.json`)); }
	return data;
}

function bbDate(dt) {
	const d = new Date(dt);
	return d.toLocaleDateString();
	// return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function bbTime(dt) {
	const t = new Date(dt);
	return t.toLocaleTimeString();
	// return `${t.getHours()}:${t.getMinutes()}`;
}

function stripHTML(msg) {
	const regex = /(<([^>]+)>)/ig;
	const result = msg.replace(regex, '');
	return result;
}

function createAnnouncement(s) {
	const announcementDate = bbDate(s.announcementStartDate);
	const announcementTime = bbTime(s.announcementStartDate);

	const reply = new MessageEmbed()
		.setColor('#3EDE0A')
		.setTitle(`Student Announcement\n${s.courseTitle}\n${announcementDate}   ${announcementTime}\n\n${s.announcementSubject}\n`)
		.setAuthor({
			name: 'Midori',
			iconURL: midoriLogoURL1,
			url: midoriLogoURL1,
		})
		.setThumbnail(midoriLogoURL1)
		.setDescription(stripHTML(s.announcement))
		// .setTimestamp()
		.setFooter({ text: 'Created by Midori', iconURL: midoriLogoURL1 });

	return reply;
}

function createCalendarEntry(s) {

	const calendarDate = bbDate(s.calendarStartDate);
	const calendarTime = bbTime(s.calendarStartDate);

	const reply = new MessageEmbed()
		.setColor('#3EDE0A')
		.setTitle('Upcoming Events\n')
		.setAuthor({
			name: 'Midori',
			iconURL: midoriLogoURL1,
			url: midoriLogoURL1,
		})
		.setThumbnail(midoriLogoURL1)

		.addFields([
			{
				name: 'Subject',
				value: `${s.calendarSubject} `,
				inline: false,
			},

			{
				name: 'Event',
				value: s.calendarMessage,
				inline: false,
			},

			{
				name: 'Date',
				value: `${calendarDate} `,
				inline: true,
			},

			{
				name: 'Time',
				value: `${calendarTime} `,
				inline: true,
			},

		])

		.setFooter({ text: 'Created by Midori', iconURL: midoriLogoURL1 });

	return reply;
}

function startAutoAnnouncements(guild) {
	const studentId = '2019003055';
	// 1,11,21,31,41,51
	guild.announcementJob = new CronJob(
		'1,11,21,31,41,51 * * * *',
		async function() {
			// Use the midorilib function to get from Azure. Submits Users as users are desired. This is returned as a parsed JSON object, not a string.
			const returnedString = await getAzure('UserObjects').catch(handleError);
			// const returnedString = await getData('userobjects');

			// Finds the element in the JSON object that matches our given student ID.
			// eslint-disable-next-line no-unused-vars

			const matches = returnedString.filter(record => record.userId === studentId && record.objectType === 'Announcement');
			const inRange = [];

			const dateTo = Date.parse(new Date());
			const dateFrom = dateTo - 1000 * (60 * 10);

			for (let i = 0; i < matches.length; i++) {
				const dateCheck = Date.parse(matches[i].announcementStartDate);
				if (dateCheck >= dateFrom && dateCheck <= dateTo) { inRange.push(matches[i]); }
			}

			for (let i = 0; i < inRange.length; i++) {
				const s = inRange[i];

				const reply = createAnnouncement(s);

				const announcementChannelTag = await guild.client.Tags.findOne({ where: { name: `${guild.id}.announcementchannel` } });
				guild.channels.cache.get(`${announcementChannelTag.get('description')}`).send({ embeds: [reply] });
			}
		},
		null,
		true,
		'Pacific/Auckland',
	);
}

function startAutoCalendar(guild) {
	const studentId = '2019003055';

	guild.calendarJob = new CronJob(
		'0 12 * * *',
		async function() {
			// Use the midorilib function to get from Azure. Submits Users as users are desired. This is returned as a parsed JSON object, not a string.
			const returnedString = await getAzure('UserObjects').catch(handleError);
			// const returnedString = await getData('userobjects');

			// Finds the element in the JSON object that matches our given student ID.
			// eslint-disable-next-line no-unused-vars

			const matches = returnedString.filter(record => record.userId === studentId && record.objectType === 'CalendarEntry');
			const inRange = [];

			const today = new Date();

			for (let i = 0; i < matches.length; i++) {
				const dateCheck = new Date(matches[i].calendarStartDate);
				if (dateDiffInDays(today, dateCheck) === 7 || dateDiffInDays(today, dateCheck) === 3 || dateDiffInDays(today, dateCheck) === 1) { inRange.push(matches[i]); }
			}

			for (let i = 0; i < inRange.length; i++) {
				const s = inRange[i];

				const reply = createCalendarEntry(s);

				const announcementChannelTag = await guild.client.Tags.findOne({ where: { name: `${guild.id}.announcementchannel` } });
				guild.channels.cache.get(`${announcementChannelTag.get('description')}`).send({ embeds: [reply] });
			}
		},
		null,
		true,
		'Pacific/Auckland',
	);
}

function startQuiz(guild) {
	const client = guild.client;
	guild.quizJob = new CronJob(
		'*/30 * * * * *',
		async function() {
			const quiz = require('./questions/quiz.json');
			const quizTag = await client.Tags.findOne({ where: { name: `${guild.id}.quizchannel` } });
			const channel = await client.channels.cache.get(quizTag.get('description'));
			const r = Math.floor(Math.random() * quiz.length);
			const item = quiz[r];


			const questionEmbed = new MessageEmbed()
				.setColor('#3EDE7A')
				.setTitle('Question:')
				.setAuthor({
					name: 'Midori',
					iconURL: midoriLogoURL1,
					url: midoriLogoURL1,
				})
				.setThumbnail(midoriLogoURL1)
				.setDescription(`${item.question}\n\n1️⃣: ${item.a1}\n2️⃣: ${item.a2}\n3️⃣: ${item.a3}`)
				.setFooter({ text: 'Created by Midori', iconURL: midoriLogoURL1 });

			const qButtonsRow = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('1️⃣')
					.setLabel('1')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('2️⃣')
					.setLabel('2')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('3️⃣')
					.setLabel('3')
					.setStyle('PRIMARY'),
			);


			const question = await channel.send({ embeds: [questionEmbed], components: [qButtonsRow], fetchReply: true });

			const collector = question.createMessageComponentCollector({ componentType: 'BUTTON', time: 25000 });

			const attemptedUsers = [];
			const correctUsers = [];

			collector.on('collect', i => {
				if (attemptedUsers.includes(i.user.id)) {
					i.reply({ content: 'You\'ve already answered this question!', ephemeral: true });
					return;
				}
				attemptedUsers.push(i.user.id);
				if (i.customId === item.correctAnswerIs) {
					correctUsers.push(i.member.displayName);
				}
				switch (i.customId) {
				case '1️⃣':
					i.reply({ content: `You've answered: 1: "${item.a1}"`, ephemeral: true });
					break;
				case '2️⃣':
					i.reply({ content: `You've answered: 2: "${item.a2}"`, ephemeral: true });
					break;
				case '3️⃣':
					i.reply({ content: `You've answered: 3: "${item.a3}"`, ephemeral: true });
					break;
				}
			});

			collector.on('end', () => {
				try {
					if (correctUsers.length === 0) {
						const noAnswers = new MessageEmbed(questionEmbed)
							.setColor('#FF9900')
							.setTitle(`Looks like nobody got the answer. The answer was: ${item.correctAnswerIs}`);
						question.edit({ embeds: [noAnswers], components: [], fetchReply: false });
					}
					else {
						let pingThesePeople = '';
						correctUsers.forEach(user => {
							pingThesePeople += `${user} `;
						});

						const correctAnswered = new MessageEmbed(questionEmbed)
							.setColor('#3EFF0A')
							.setTitle(`Question answered! The answer was: ${item.correctAnswerIs}`)
							.addField('Answered correctly by: ', pingThesePeople, true);
						question.edit({ embeds: [correctAnswered], components: [], fetchReply: false });
					}
				}
				catch (err) {
					console.log(err);
				}
			});
		},
		null,
		true,
		'America/Los_Angeles',
	);
}
const { endpoint, masterKey, databaseId } = require('./config.json');

const client = new CosmosClient({ endpoint, key: masterKey });

const querySpec = {
	query: 'SELECT * FROM c ORDER BY c.recordSortDateTime DESC',
};

async function getAzure(containerId) {
	const database = client.database(databaseId);
	const container = database.container(containerId);

	const { resources: results } = await container.items.query(querySpec, { enableCrossPartitionQuery: true }).fetchAll();

	return JSON.parse(JSON.stringify(results));
}

function handleError(error) {
	console.log(error);
	console.log('\nAn error with code \'' + error.code + '\' has occurred:');
	console.log('\t' + error.body || error);
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

module.exports = { getData, bbDate, bbTime, getAzure, handleError, startAutoAnnouncements, startAutoCalendar, createAnnouncement, createCalendarEntry, startQuiz };
