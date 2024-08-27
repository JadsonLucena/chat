import express from 'express'

const app = express()

app.use(express.static('src'))

const PORT = parseInt(process.env.PORT ?? '8080')

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})