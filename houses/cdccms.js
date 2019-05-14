var dotenv = require('dotenv')
var request = require('request')

dotenv.config()

var MySQLEvents = require('mysql-events');
// var dsn = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS
// }

var dsn = {
    host: 'localhost',
    user: 'iwang',
    password: 'Root@!234'
}

var myCon = MySQLEvents(dsn);
console.log('\tNetwork : localhost')
console.log('\t\tHouse : cdccms')
console.log('\t\t\tRoom : etl_log')

var table_version = myCon.add(
    'ep_cdc.version',
     async function (oldRow, newRow, res) {
        //new row inserted 
        if (oldRow === null && newRow !== null) {
            console.log('new row detected')
        }

        //row updated
        if (oldRow !== null && newRow !== null) {
            let data = {
                title: "data update detected!",
                table: `${newRow.database}.${newRow.table}`,
                column: newRow.changedColumns,
                old_data: oldRow.fields,
                new_data: newRow.fields
            }
            console.log('we send some info to our gateway')
            request.post(`${process.env.REST_GATEWAY}ghost/fulfilment`, data)
        }
 
        //row deleted
        if (oldRow !== null && newRow === null) {
            console.log('row deleted')
        } 
    }
);