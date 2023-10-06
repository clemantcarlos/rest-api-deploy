import express, { json } from 'express' // require -> commonJS
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
})