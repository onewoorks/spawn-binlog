const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const logger = require('../templates/logger')
var dotenv = require('dotenv')
var passData = require('../templates/passing_data')
var res_event = require('../event/etl_log')

dotenv.config()

logger.initmessage({
    network: 'localhost',
    house: 'sample_feeder',
    room: [
        'version',
        'etl_log'
    ]
})

const program = async () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'iwang',
        password: 'Root@!234',
    });

    const instance = new MySQLEvents(connection, {
        server_id: 1,
        startAtEnd: true,
        excludedSchemas: {
            mysql: true,
        },
    });

    await instance.start();

    instance.addTrigger({
        name: 'etl_log',
        expression: 'sample_feeder.etl_log',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => {
            res_event.watch_column_current(event, 'etl_status', 'SUCCESS', result => {
                if(result){
                    passData.send_to_gateway(event, newData.TableETL)
                } else {
                    logger.response_message('etl_status out of scoped..')
                }
            })
        },
    });

    instance.addTrigger({
        name: 'version',
        expression: 'sample_feeder.version',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => {
            console.log(event)
        }
    })

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);