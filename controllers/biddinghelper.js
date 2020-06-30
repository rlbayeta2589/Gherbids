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
		this.start_reminders = [];
		this.end_reminders = [];
	}

	isBiddingActive() {
		return this.BIDDING_SESSION_ACTIVE;
	}

	periodicScheduleCheck() {
		this.heartbeat = schedule.scheduleJob('*/15 * * * * *', this.assignScheduleData.bind(this));
	}

	tempReminder(temp){
		console.log(temp);
	}

	async assignScheduleData() {
		await masterlisthelper.syncScheduleData();

		let today = moment();
		let bidding_session = masterlisthelper.getLatestSchedule();

		console.log("TEST" + bidding_session.date);

		// if (!bidding_session || (this.start_date && this.start_date.format('YYYY-MM-DD') == bidding_session.date)) return;

		// this.start_date = moment(bidding_session.date);
		// this.end_date = this.start_date.clone().add(bidding_session.duration, 'hours');

		if (!bidding_session || this.start_date) return;
		this.start_date = moment('2020-06-30 14:06');
		this.end_date = this.start_date.clone().add(6, 'minute');

		console.log(today);
		console.log(this.start_date);
		console.log(this.end_date);

		console.log("IS BEFORE START ? " + today.isBefore(this.start_date))
		if (today.isBefore(this.start_date)) {
			this.cancelStartSchedule();
			this.start_schedule = schedule.scheduleJob(this.start_date.toDate(), () => {
				this.BIDDING_SESSION_ACTIVE = true;
				console.log("START BIDDING");
			});

			let hour_before_01 = this.start_date.clone().subtract(1, 'hour');
			let min_before_05 =  this.start_date.clone().subtract(5, 'minute');

			this.cancelStartReminders();
			console.log('START REMINDERS');
			this.start_reminders.push(schedule.scheduleJob(hour_before_01.toDate(), () => this.tempReminder("1 HOUR BEFORE THE BIDDING")));
			this.start_reminders.push(schedule.scheduleJob(min_before_05.toDate(), () => this.tempReminder("5 MINUTES BEFORE THE BIDDING")));
		}

		console.log("IS BEFORE END ? " + today.isBefore(this.end_date))
		if (today.isBefore(this.end_date)) {
			if (today.isSameOrAfter(this.start_date)) {
				this.BIDDING_SESSION_ACTIVE = true;
			}

			this.cancelEndSchedule();
			this.end_schedule = schedule.scheduleJob(this.end_date.toDate(), () => {
				this.BIDDING_SESSION_ACTIVE = false;
				this.clearScheduleData();
				console.log("END BIDDING");
			});

			// refactor later
			let hour_left_06 = this.end_date.clone().subtract(6, 'hour');
			let hour_left_03 = this.end_date.clone().subtract(3, 'hour');
			let hour_left_01 = this.end_date.clone().subtract(1, 'hour');
			let min_left_30 = this.end_date.clone().subtract(30, 'minute');
			let min_left_15 = this.end_date.clone().subtract(15, 'minute');
			let min_left_10 = this.end_date.clone().subtract(10, 'minute');
			let min_left_05 = this.end_date.clone().subtract(5, 'minute');
			let min_left_03 = this.end_date.clone().subtract(3, 'minute');
			let min_left_02 = this.end_date.clone().subtract(2, 'minute');
			let min_left_01 = this.end_date.clone().subtract(1, 'minute');

			this.cancelEndReminders();
			console.log('END REMINDERS');
			this.end_reminders.push(schedule.scheduleJob(min_left_03.toDate(), () => this.tempReminder("3 MINUTES LEFT IN THE BIDDING")));
			this.end_reminders.push(schedule.scheduleJob(min_left_02.toDate(), () => this.tempReminder("2 MINUTES LEFT IN THE BIDDING")));
			this.end_reminders.push(schedule.scheduleJob(min_left_01.toDate(), () => this.tempReminder("1 MINUTE LEFT IN THE BIDDING")));
		}

		console.log(this.start_date);
		console.log(this.end_date);
	}

	clearScheduleData() {
		this.cancelStartSchedule();
		this.cancelStartReminders();
		this.cancelEndSchedule();
		this.cancelEndReminders();
	}

	cancelStartSchedule() {
		if (this.start_schedule) {
			this.start_schedule.cancel();
			this.start_schedule = null;
		}
	}

	cancelEndSchedule() {
		if (this.end_schedule) {
			this.end_schedule.cancel();
			this.end_schedule = null;
		}
	}

	cancelStartReminders() {
		if (this.start_reminders && this.start_reminders.length) {
			this.start_reminders.forEach((sched) => sched.cancel());
			this.start_reminders = [];
		}
	}

	cancelEndReminders() {
		if (this.end_reminders && this.end_reminders.length) {
			this.end_reminders.forEach((sched) => sched.cancel());
			this.end_reminders = [];
		}
	}
}

module.exports = new BiddingHelper();