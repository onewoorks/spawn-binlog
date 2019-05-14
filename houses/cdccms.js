const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const logger = require('../templates/logger')
var dotenv = require('dotenv')
var passData = require('../templates/passing_data')

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
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    const instance = new MySQLEvents(connection, {
        server_id:2,
        startAtEnd: true,
        excludedSchemas: {
            mysql: true,
        },
    });

    await instance.start();

    instance.addTrigger({
        name: 'etl_log',
        expression: 'cdccms.etl_log',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => { 
            let newData = JSON.parse(event.affectedRows[0].after.etl_data)
            res_event.watch_column_current(event, 'etl_status', 'SUCCESS', result => {
                if(result){
                    passData.send_to_gateway(event, newData.TableETL)
                } else {
                    logger.response_message('etl_status out of scoped..')
                }
            })          
        },
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);