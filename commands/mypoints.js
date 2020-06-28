const masterlist = require('../controllers/masterlist');

module.exports = {
	name: 'mypoints',
	description: 'Display your current bidding points.',
	sample: ['/mypoints'],
	execute(message, args) {
		let user_id = message.author.id;
		let ign = masterlist.getInGameName(user_id);
		let points = masterlist.getPersonalPoints(ign);
		message.channel.send(`You currently have **${points} points**.`);
	},
};