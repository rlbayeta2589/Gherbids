const masterlist = require('../controllers/masterlist');

module.exports = {
	name: 'stalkpoints',
	description: 'Display points of other players. Can also be used by tagging the player\'s discord account.',
	sample: ['/stalkpoints Gherzales', '/stalkpoints @Gherzales'],
	execute(message, args) {
		if (!args.length || args.length > 1) {
			return message.reply('Please specify one player name to stalk.');
		}

		let mention = message.mentions.users.first();
		let ign = args[0];

		if (mention) {
			console.log(mention);
			ign = masterlist.getInGameName(mention);
		}

		let points = masterlist.getPersonalPoints(ign);

		if (!points) {
			return message.reply(`Sorry, player ***${ign}*** does not exist in my data.`);
		}

		message.channel.send(`Player ***${ign}*** currenly have **${points} points**.`)
	},
};