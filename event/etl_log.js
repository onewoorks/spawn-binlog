module.exports = {
    watch_column_current: (events, column_name, watch_for, callback) => {
        let e = events.affectedRows[0].after[column_name]
        if (e == watch_for){
            callback(true) 
        } else {
            callback(false)
        }
    }
}