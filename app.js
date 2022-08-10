const PORT = 3001
const express = require('express')
const app = express()
const bookRouter = require('./routes/books')
const customerRouter = require('./routes/customers')
const infosRouter = require('./routes/rental_infos')
app.use('/api/books',bookRouter)
app.use('/api/customers',customerRouter)
app.use('/api/infos',infosRouter)
app.listen(PORT,()=>{
    console.log("IWlayapti")
})





