const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()

const whitelist = ['http://localhost:3000', 'https://localhost:3000', 'https://whats-for-dinner.netlify.com']

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

const jsonParser = bodyParser.json()

app.use(cors())

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

app.put(`/recipe`, jsonParser, async (req, res) => {
  const jsonToday = new Date().toJSON();
  const justTheDate = jsonToday.slice(0, 10);
  const plusOneEaten = req.body.timesEaten++
  try {
    console.dir('mlab recipe: ', req.body)
    const updatedRecipe = await axios({
      method: 'put',
      url: `https://api.mlab.com/api/1/databases/wfddev/collections/recipes/${req.body._id}?apiKey=${process.env.MLAB_SECRET}`,
      data: JSON.stringify( { "$set" : {
        "lastEaten": justTheDate,
        "timesEaten": plusOneEaten
      }})
    })
    res.send(updatedRecipe)
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

app.post('/add-recipe', jsonParser, async (req, res) => {
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