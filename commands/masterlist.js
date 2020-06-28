const masterlisthelper = require('../controllers/masterlisthelper');

module.exports = {
	name: 'masterlist',
	description: 'Display the link of the masterlist file.',
	sample: ['/masterlist'],
	execute(message, args) {
		let masterlistURL = masterlisthelper.getMasterListURL();
		message.channel.send(`Masterlist link : <${masterlistURL}>`);
	},
};