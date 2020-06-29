const util = require('util');
const moment = require('moment');

class DateTimeFormat {

    constructor() {

    }

    scheduleMessageFormat(data) {
        let upcomming_format = "**%s** will start at %s %s for %s hours that will start in %s hours.";
        let active_format = "**%s** started at %s %s for %s hours that will end in %s hours.";

        let current_format = upcomming_format;
        let bidding_session = moment(data.date);
        let bidding_time = bidding_session.format('YYYY-MM-DD HH:mm:ss');
        let timezone = "+" + data.timezone.substring(4).padStart(2, '0') + ":00";
        let remaining_time = Math.floor(moment.duration(bidding_session.diff(moment())).asHours());

        if (remaining_time < 0) {
            current_format = active_format;
            remaining_time = Math.floor(moment.duration(bidding_session.add(data.duration, 'hours').diff(moment())).asHours());
        }

        let message = util.format(current_format, data.name, bidding_time, timezone, data.duration, remaining_time);
        return message;
    }
}

module.exports = new DateTimeFormat();