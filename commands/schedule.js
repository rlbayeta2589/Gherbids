const masterlisthelper = require('../controllers/masterlisthelper');
const biddinghelper = require('../controllers/biddinghelper');
const date_format = require('../utils/datetimeformat');

module.exports = {
	name: 'schedule',
	description: 'Display information for an active or upcomming bidding schedule.',
	sample: ['/schedule'],
	execute(message, args) {
		let bidding_msg = "";
		let bidding_sched = masterlisthelper.getLatestSchedule();
		if (!bidding_sched) {
			return message.channel.send('There are no upcomming or active bidding session.');
		}

		bidding_msg = date_format.scheduleMessageFormat(bidding_sched);

		let temp = biddinghelper.isBiddingActive();

		message.channel.send("BIDDING STATUS : " + (temp ? "active" : "not active"));
	},
};