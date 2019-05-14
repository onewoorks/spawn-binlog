const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const program = async () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'iwang',
        password: 'Root@!234',
    });

    const instance = new MySQLEvents(connection, {
        serverId: 3,
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
        onEvent: (event) => { // You will receive the events here
            console.log(event);
        },
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);