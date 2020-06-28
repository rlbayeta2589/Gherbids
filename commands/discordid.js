module.exports = {
	name: 'discordid',
	description: 'Display your Discord ID.',
	sample: ['/discordid'],
	execute(message, args) {
		let user_id = message.author.id;
		message.reply(`Your discord ID is: ${user_id}`);
	},
};