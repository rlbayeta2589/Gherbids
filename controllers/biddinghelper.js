const moment = require('moment');
const env = require('dotenv').config();
const schedule = require('node-schedule');
const masterlisthelper = require('./masterlisthelper');
const clienthelper = require('./clienthelper');

class BiddingHelper {

	constructor() {
		this.BIDDING_SESSION_ACTIVE = false;

		this.heartbeat = null;
		this.bidding_session = null;
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

	async assignScheduleData() {
		await masterlisthelper.syncScheduleData();

		let today = moment();
		this.bidding_session = masterlisthelper.getLatestSchedule();

		console.log("TEST" + this.bidding_session.date);

		// if (!this.bidding_session || (this.start_date && this.start_date.format('YYYY-MM-DD') == this.bidding_session.date)) return;
		// this.start_date = moment(this.bidding_session.date);
		// this.end_date = this.start_date.clone().add(this.bidding_session.duration, 'hours');

		if (!this.bidding_session || this.start_date) return;
		this.start_date = moment('2020-07-01 18:03');
		this.end_date = this.start_date.clone().add(1, 'minute');

		console.log(today);
		console.log(this.start_date);
		console.log(this.end_date);

		console.log("IS BEFORE START ? " + today.isBefore(this.start_date))
		if (today.isBefore(this.start_date)) {
			this.cancelStartSchedule();
			this.createStartSchedule();

			this.cancelStartReminders();
			this.createStartReminders();
		}

		console.log("IS BEFORE END ? " + today.isBefore(this.end_date))
		if (today.isBefore(this.end_date)) {
			if (today.isSameOrAfter(this.start_date)) {
				this.BIDDING_SESSION_ACTIVE = true;
			}

			this.cancelEndSchedule();
			this.createEndSchedule();

			this.cancelEndReminders();
			this.createEndReminders();
		}
	}

	sendReminder(value, unit) {
		clienthelper.sendBiddingChannelMessage(`Bidding Reminder  ( ${value} : ${unit} )`);
	}

	clearScheduleData() {
		this.cancelStartSchedule();
		this.cancelStartReminders();
		this.cancelEndSchedule();
		this.cancelEndReminders();
	}

	createStartSchedule() {
		this.start_schedule = schedule.scheduleJob(this.start_date.toDate(), () => {
			this.BIDDING_SESSION_ACTIVE = true;
			clienthelper.sendBiddingChannelMessage("START BIDDING");
			console.log("START BIDDING");
		});
	}

	cancelStartSchedule() {
		if (this.start_schedule) {
			this.start_schedule.cancel();
			this.start_schedule = null;
		}
	}

	createEndSchedule() {
		this.end_schedule = schedule.scheduleJob(this.end_date.toDate(), () => {
			this.BIDDING_SESSION_ACTIVE = false;
			this.clearScheduleData();
			clienthelper.sendBiddingChannelMessage("END BIDDING");
			console.log("END BIDDING");
		});
	}

	cancelEndSchedule() {
		if (this.end_schedule) {
			this.end_schedule.cancel();
			this.end_schedule = null;
		}
	}

	createStartReminders() {
		let hour_reminders = process.env.HOUR_START_REMINDERS.split(',');
		let min_reminders = process.env.MINUTE_START_REMINDERS.split(',');

		console.log("HOUR START");
		hour_reminders.forEach((x) => {
			let hour = Number(x);
			let reminder = this.start_date.clone().subtract(hour, 'hour');
			this.start_reminders.push(schedule.scheduleJob(reminder.toDate(), () => this.sendReminder(hour, 'hour')));
		});

		console.log("MIN START");
		min_reminders.forEach((x) => {
			let minute = Number(x);
			let reminder = this.start_date.clone().subtract(minute, 'minute');
			this.start_reminders.push(schedule.scheduleJob(reminder.toDate(), () => this.sendReminder(minute, 'minute')));
		});
	}

	cancelStartReminders() {
		if (this.start_reminders && this.start_reminders.length) {
			this.start_reminders.forEach((sched) => {
				if (sched) sched.cancel();
			});
			this.start_reminders = [];
		}
	}

	createEndReminders() {
		let hour_reminders = process.env.HOUR_END_REMINDERS.split(',');
		let min_reminders = process.env.MINUTE_END_REMINDERS.split(',');

		console.log("HOUR END");
		hour_reminders.forEach((x) => {
			let hour = Number(x);
			let reminder = this.end_date.clone().subtract(hour, 'hour');
			this.end_reminders.push(schedule.scheduleJob(reminder.toDate(), () => this.sendReminder(hour, 'hour')));
		});

		console.log("MIN END");
		min_reminders.forEach((x) => {
			let minute = Number(x);
			let reminder = this.end_date.clone().subtract(minute, 'minute');
			this.end_reminders.push(schedule.scheduleJob(reminder.toDate(), () => this.sendReminder(minute, 'minute')));
		});
	}

	cancelEndReminders() {
		if (this.end_reminders && this.end_reminders.length) {
			this.end_reminders.forEach((sched) => {
				if (sched) sched.cancel();
			});
			this.end_reminders = [];
		}
	}
}

module.exports = new BiddingHelper();