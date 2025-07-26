import express from 'express'
import path from 'node:path'

const PORT = 8000

const app = express()

const __dirname = import.meta.dirname

app.use(express.static(path.join(__dirname, 'dist')))


app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => console.log(`server running on port: ${PORT}`))