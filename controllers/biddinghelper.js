const masterlisthelper = require('../controllers/masterlisthelper');
const schedule = require('node-schedule');

class BiddingHelper {

	constructor() {
		this.heartbeat = null;
		this.start_date = null;
		this.end_date = null;
		this.start_schedule = null;
		this.end_schedule = null;
		this.start_reminders = null;
		this.end_reminders = null;
	}

	periodicScheduleCheck() {
		this.heartbeat = schedule.scheduleJob('*/5 * * * *', function(){
		  console.log(new Date().toString());
		});
	}
}

module.exports = new BiddingHelper();