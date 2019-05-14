var request = require('request')
var dotenv = require('dotenv')
var logger = require('./logger')
dotenv.config()

filter_change = (columns, data_set) => {
    var response = {}
    columns.forEach(value => {
        if (data_set.hasOwnProperty(value)) {
            response[value] = data_set[value]
        }
    })
    return response
}

module.exports = {
    send_to_gateway: (event, route) => {
        let data = {
            title: `MySQL event ${event.type} detected!`,
            table: `sample_feeder.${event.table}`,
            column: event.affectedColumns,
            old_data: filter_change(event.affectedColumns, event.affectedRows[0].before),
            new_data: filter_change(event.affectedColumns, event.affectedRows[0].after),
            full_data: event.affectedRows
        }
        request.post({
            headers: {'content-type' : 'application/json'},
            url:     `${process.env.REST_GATEWAY}ghost/${route}`,
            body:    JSON.stringify(data)
          })
        logger.sendmessage(data)
    }
}