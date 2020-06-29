const moment = require('moment');
const schedule = require('node-schedule');
const masterlisthelper = require('./masterlisthelper');

class BiddingHelper {

	constructor() {
		this.BIDDING_SESSION_ACTIVE = false;

		this.heartbeat = null;
		this.start_date = null;
		this.end_date = null;
		this.start_schedule = null;
		this.end_schedule = null;
		this.start_reminders = null;
		this.end_reminders = null;
	}

	isBiddingActive() {
		return this.BIDDING_SESSION_ACTIVE;
	}

	periodicScheduleCheck() {
		this.heartbeat = schedule.scheduleJob('*/5 * * * * *', this.assignScheduleData);
	}

	assignScheduleData() {
		let today = moment();
		let bidding_session = masterlisthelper.getLatestSchedule();

		console.log("TEST");

		if (!bidding_session || (this.start_date && this.start_date.format('YYYY-MM-DD') == bidding_session.date)) return;

		this.start_date = moment('2020-06-30 12:10');
		this.end_date = this.start_date.clone().add(bidding_session.duration, 'hours');

		this.start_schedule = schedule.scheduleJob(this.start_date.toDate(), () => this.BIDDING_SESSION_ACTIVE = true);
		this.end_schedule = schedule.scheduleJob(this.end_date.toDate(), () => this.BIDDING_SESSION_ACTIVE = false);

		console.log(this.start_date);
		console.log(this.end_date);
	}
}

module.exports = new BiddingHelper();