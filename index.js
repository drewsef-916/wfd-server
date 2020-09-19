const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())

app.get(`/`, (req, res) => {
    res.send(`API root`)
})

app.get(`/recipes`, async (req, res) => {
    try {
        const recipes = await axios.get(
          `https://mongo-data-api-wfd/api/1/databases/wfddev/collections/recipes?apiKey=${process.env.MLAB_DATA_API_KEY}`
        );
        res.send(JSON.stringify(recipes.data));
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => console.log(`app running on port ${PORT}`))