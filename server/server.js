import express, { json, urlencoded } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};-

app.use(json());
app.use(urlencoded({ extended: false }))
app.use(cors(corsOptions));

const port = 5501

connect("mongodb://localhost:27017/ClinicOfficeSystem")
    .then(() => {
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection failed!')
    })

// app.use('/api/auth', AuthRoute)
// app.use('/api/get', GetAPIs);
// app.use('/api/services', Services)
// app.use('/api/set', SetAPIs)
// app.use('/api/update', UpdateAPIs)
// app.use('/api/delete', DeleteAPIs)

app.get('/', (req, res) => res.send('Hello World!'))