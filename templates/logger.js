module.exports = {
    initmessage: (data) => {
        console.log(`\tNetwork : ${data.network}`)
        console.log(`\t\tHouse : ${data.house}`)
        data.room.forEach(value =>{
            console.log(`\t\t\tRoom : ${value}`)
        })
    },
    sendmessage: (data) => {
        delete data['full_data']
        console.log('ORDER SENT TO WORKER >> ')
        console.log(data)
        console.log('\r')
    }
}  