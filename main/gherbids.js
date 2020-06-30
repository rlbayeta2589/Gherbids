const Discord = require('discord.js');
const env = require('dotenv').config();
const fs = require('fs');

const masterlisthelper = require('../controllers/masterlisthelper');
const biddinghelper = require('../controllers/biddinghelper');
const tableformat = require('../utils/tabletextformat');

class Gherbids {
    constructor() {
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
    }

    async initializeBot() {
        console.log('Initializing masterlist file . . .');
        await masterlisthelper.initialize();

        console.log('Initializing schedule heartbeat . . .');
        biddinghelper.periodicScheduleCheck();

        console.log('Logging in . . .');
        this.client.login(process.env.BOT_TOKEN);
    }

    prepareBot() {
        console.log('Preparing bot . . .');
        this.bindReadyEvent();

        console.log('Getting ready for messages . . .');
        this.bindMessageEvent();
    }

    importCommands() {
        let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (let file of commandFiles) {
            let command = require(`./commands/${file}`);
            tableformat.addCommand(command.name, command.description, command.sample);
            this.client.commands.set(command.name, command);
        }
    }

    bindReadyEvent() {
        this.client.once('ready', () => {
            console.log('\n=========  GHERBIDS NOW ONLINE  =========\n');
            this.client.user.setActivity("as 'Son of Ghervis'", {'type': 'WATCHING'});
        });
    }

    bindMessageEvent() {
        this.client.on('message', msg => {
            let prefix = process.env.PREFIX.substring(1);

            if (!msg.content.startsWith(prefix) || msg.author.bot) return;
        
            const args = msg.content.slice(prefix.length).split(/ +/);
            const command = args.shift().toLowerCase();
        
            if (!this.client.commands.has(command)) return;
        
            try {
                this.client.commands.get(command).execute(msg, args);
            } catch (error) {
                console.error(error);
                msg.reply('there was an error trying to execute that command!');
            }
        
            console.log(msg.content);
        });
    }
 }

 module.exports = new Gherbids();