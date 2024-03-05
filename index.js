const connectmongo = require("./db");
const express = require('express')
var cors = require('cors')
connectmongo();

const app = express()
const port = process.env.PORT || 5000;
 
app.use(cors())

app.use(express.json());

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/', (req, res) => {    
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Inotebook app listening on port ${port}`)
})



