const masterlisthelper = require('../controllers/masterlisthelper');

module.exports = {
	name: 'mypoints',
	description: 'Display your current bidding points.',
	sample: ['/mypoints'],
	execute(message, args) {
		let user_id = message.author.id;
		let ign = masterlisthelper.getInGameName(user_id);
		let points = masterlisthelper.getPersonalPoints(ign);
		message.channel.send(`You currently have **${points} points**.`);
	},
};