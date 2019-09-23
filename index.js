const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()

const whitelist = ['http://localhost:3000', 'https://localhost:3000', 'https://whats-for-dinner.netlify.com']

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))

app.get(`/`, (req, res) => {
    res.send(`API root`)
})

app.get(`/recipes`, async (req, res) => {
    try {
        const recipes = await axios.get(`https://api.mlab.com/api/1/databases/wfddev/collections/recipes?apiKey=${process.env.MLAB_SECRET}`)
        res.send(JSON.stringify(recipes.data));
    } catch (err) {
        console.log(err)
    }
})

app.get(`/recipe/:id`, async (req, res) => {
    try {
      const recipes = await axios.get(`https://api.mlab.com/api/1/databases/wfddev/collections/recipes?apiKey=${process.env.MLAB_SECRET}`)
      const routeId = req.params.id
      const match = recipes.data.find(recipe => {
        recipe.id === routeId
      })
      res.send(match)
    } catch (err) {
      console.log(err)
    }
})

app.post('/add-recipe', async (req, res) => {
    try {
      await axios.post(`https://api.mlab.com/api/1/databases/wfddev/collections/recipes?apiKey=${process.env.MLAB_SECRET}`, {
        id: req.body.id,
        name: req.body.name,
        ingredients: req.body.ingredients,
        directions: req.body.directions
      })
      res.send('Success!')
    } catch(err) {
      console.log(err)
    }
  })

//   app.delete('/delete-recipe', async (req, res) => {
//       try {
//         await axios.delete(`https://api.mlab.com/api/1/databases/wfddev/collections/recipes/${req.body.id}?apiKey=${process.env.MLAB_SECRET}`)
//         res.send('You have sucessfully deleted the recipe!')
//       } catch(err) {
//         console.log(err)
//       }
//   })

app.listen(PORT, () => console.log(`app running on port ${PORT}`))