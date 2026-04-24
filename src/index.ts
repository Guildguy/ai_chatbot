import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import chatRoutes from './routes/chatRoutes'

const app = express()
const PORT = 3000

app.use(express.json())
app.use('/api', chatRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) })