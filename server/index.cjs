const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()

app.use(express.static(path.join(__dirname, '../oj')))

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../oj', 'index.html'))
})

app.listen(port, function () {
  console.log('server started on port ' + port)
})
