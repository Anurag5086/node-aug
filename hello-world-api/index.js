const express = require('express')
const app = express()

app.get('/hello-world', (req, res) => {
    res.json({ message: "Hello world!" })

    //100lines
})

// app.get('/blog/:id', (req, res) => {
//     const blogId = req.params.id

//     // 50lines
// })

// axios.get('http://localhost:3000/blogs?author=Shivam&topic=AI')

// app.get('/blogs', (req, res) => {
//     const author = req.query.author
//     const topic = req.query.topic
// })

app.listen(3000, () => {
    console.log('Server is running at PORT:3000')
})