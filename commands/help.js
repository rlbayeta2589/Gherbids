const table_format = require('../utils/tabletextformat');

module.exports = {
	name: 'help',
	description: 'Displays the command list',
	sample: ['/help'],
	execute(message, args) {
		let help = "";
		help = !args.length ? table_format.formatHelpTable() : table_format.formatHelpSingle(args[0]);
		message.channel.send(help);
	},
};