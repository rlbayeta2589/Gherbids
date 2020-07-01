const env = require('dotenv').config();

class ClientHelper {

	constructor() {
		this.client = null;
	}

	bindDiscordClient(client) {
		this.client = client;
		this.channels = {
			'bidding_channel': process.env.BIDDING_CHANNEL_ID,
			'general_channel': process.env.GENERAL_CHANNEL_ID,
		};
		this.roles = {
			'bidder_role': process.env.BIDDER_ROLE_ID,
			'member_role': process.env.MEMBER_ROLE_ID,
		}
	}

	sendPrivateMessage(discordID) {

	}

	sendBiddingChannelMessage(message) {
		this.client.channels.cache.get(this.channels.bidding_channel).send(message);
	}

	sendDoingChannelMessage(message) {
		this.client.channels.cache.get(this.channels.general_channel).send(message);
	}
}

module.exports = new ClientHelper();