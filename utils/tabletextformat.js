class TableTextFormat {

	constructor() {
		this.commands = [];
		this.spacing = 15;
	}

	addCommand(name, desc, sample) {
		this.commands.push({
			"cmd_name": name,
			"cmd_desc": desc,
			"cmd_sample": sample,
		});
	}

	encloseCodeBlock(data) {
		return ["```", data, "```"].join('\n');
	}

	enclosePipe(data) {
		return ["| ", data, " |"].join('');
	}

	formatInventoryTable(spacing, headers, data) {
		let inventory_table = [];
		let temp = "";

		temp = headers.map((x, index) => x.padEnd(spacing[index], " ")).join(' | ');
		inventory_table.push(this.enclosePipe(temp));

		temp = spacing.map((x) => "-".repeat(x)).join(' | ');
		inventory_table.push(this.enclosePipe(temp));

		data.map((row) => {
			temp = row.map((x, index) => x.padEnd(spacing[index], " ")).join(' | '); 
			inventory_table.push(this.enclosePipe(temp));
		});

		return this.encloseCodeBlock(inventory_table.join('\n'));
	}

	formatHelpTable() {
		let temp = "";
		let help_table = [];

		temp = this.enclosePipe("    H E L P    ");
		help_table.push(temp);

		temp = this.enclosePipe("-".repeat(this.spacing));
		help_table.push(temp)

		let names = this.commands.map((x) => this.enclosePipe(x.cmd_name.padEnd(this.spacing)));
		help_table.push(...names);

		temp = "\nFor more details, please use:\n/help <command>"; 
		help_table.push(temp);

		return this.encloseCodeBlock(help_table.join('\n'));
	}

	formatHelpSingle(name) {
		let cmd = this.commands.filter((x) => x.cmd_name == name);
		let temp = "";
		let single = [];

		if (!cmd.length) {
			return `Command not found : <***${name}***>.`;
		}

		cmd = cmd[0];
		temp = this.enclosePipe("Command Name".padEnd(this.spacing));
		single.push([temp, cmd.cmd_name].join("    "));

		temp = this.enclosePipe("Description".padEnd(this.spacing));
		single.push([temp, cmd.cmd_desc].join("    "));

		temp = this.enclosePipe("Example".padEnd(this.spacing));
		single.push([temp, cmd.cmd_sample].join("    "));

		return this.encloseCodeBlock(single.join('\n'));
	}

}

module.exports = new TableTextFormat();