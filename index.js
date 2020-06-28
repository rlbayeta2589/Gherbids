const fs = require('fs');
const env = require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const prefix = process.env.PREFIX.substring(1);
const masterlisthelper = require('./controllers/masterlisthelper');
const biddinghelper = require('./controllers/biddinghelper');
const tableformat = require('./utils/tabletextformat');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

masterlisthelper.initialize();
biddinghelper.periodicScheduleCheck();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	tableformat.addCommand(command.name, command.description, command.sample);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity("as 'Son of Ghervis'", {'type': 'WATCHING'});
});

client.on('message', message => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

	console.log(message.content);
});


client.login(process.env.BOT_TOKEN);