const masterlist = require('../controllers/masterlist');

module.exports = {
	name: 'inventory',
	description: 'Display the current inventory of the guild.',
	sample: ['/inventory'],
	execute(message, args) {
		let inventory = masterlist.getInventory();
		if (!inventory) {
			return message.reply(`Sorry, cannot retrieve inventory data.`);
		}
		message.channel.send(inventory);
	},
};