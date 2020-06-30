const moment = require('moment');
const env = require('dotenv').config();
const config = require('../gherbids.json');	
const table_format = require('../utils/tabletextformat');
const { GoogleSpreadsheet } = require('google-spreadsheet');

class MasterListHelper {

	constructor() {
		this.doc = new GoogleSpreadsheet(process.env.MASTERLIST_ID);
	}

	async initialize() {
		await this.doc.useServiceAccountAuth(config);
		await this.doc.loadInfo();

		let names = this.doc.sheetsByIndex[0];
		let points = this.doc.sheetsByIndex[1];
		let inventory = this.doc.sheetsByIndex[2];
		let history = this.doc.sheetsByIndex[3];
		let items = this.doc.sheetsByIndex[4];
		let orders = this.doc.sheetsByIndex[5];
		let rewards = this.doc.sheetsByIndex[6];
		let schedules = this.doc.sheetsByIndex[7];
		let admins = this.doc.sheetsByIndex[8];

		this.names = await names.getRows();
		this.points = await points.getRows(); 
		this.inventory = await inventory.getRows(); 
		// this.history = await history.getRows();
		// this.items = await items.getRows();
		// this.orders = await orders.getRows();
		// this.rewards = await rewards.getRows();
		this.schedules = await schedules.getRows();
		// this.admins = await admins.getRows();
	}

	getMasterListURL() {
		return ["https://docs.google.com/spreadsheets/d/", process.env.MASTERLIST_ID].join('');
	}

	getInGameName(user_id) {
		let row = this.names.filter((x) => x["Discord ID"] == user_id );
		return row.length ? row[0]["Team Name"] : "";
	}

	getPersonalPoints(tos_name) {
		let row = this.points.filter((x) => x["Team Name"] == tos_name );
		return row.length ? row[0]["Current Points"] : "";
	}

	getInventory() {
		let headers = ["Item Name", "Amount", "Min Price", "Category", "Keyword"];
		let table_space = [30, 6, 9, 10, 10];
		let rows = this.inventory.map((x) => x._rawData.slice(0, 5));
		return rows.length ? table_format.formatInventoryTable(table_space, headers, rows) : "";
	}

	async syncScheduleData() {
		let schedules = this.doc.sheetsByIndex[7];
		this.schedules = await schedules.getRows();
	}

	isBiddingScheduleValid(data) {
		let today = moment();
		let end_sched = moment(data.date).add(data.duration, 'hours');
		return today.isSameOrBefore(end_sched);
	}

	getLatestSchedule() {
		if (!this.schedules || !this.schedules.length) return null;

		let row = this.schedules[this.schedules.length - 1];
		let latest_sched = row._rawData;
		let bidding_sched = {
			'name': latest_sched[0],
			'date': latest_sched[1],
			'duration': latest_sched[2],
			'timezone': latest_sched[3],
		}
		
		return this.isBiddingScheduleValid(bidding_sched) ? bidding_sched : null;
	}

	getInfo() {
		return this.doc.title;
	}

}

module.exports = new MasterListHelper();