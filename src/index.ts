import express from 'express'
import chatRoutes from './routes/chatRoutes'

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api', chatRoutes)

app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) })