module.exports = {
	name: 'admin',
	description: 'Display our Guild Master',
	sample: ['/admin'],
	execute(message, args) {
		message.channel.send(`Admin is Gherzales. :smile:`);
	},
};