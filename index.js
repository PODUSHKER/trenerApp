// express - app
const express = require('express');
const app = express();

// local environment
const dotenv = require('dotenv');
dotenv.config()

// routes
const mainRouter = require('./routes/mainRoutes.js')

// other utils
const hbsConfig = require('./utils/hbsConfig');
const cookieParser = require('cookie-parser')
const associations = require('./models/associations.js')
const { sequelize } = require('./utils/dbSettings.js')
const path = require('path');
const authChecker = require('./utils/authChecker.js');

// configure app settings
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'hbs')
app.set('views', 'templates')

app.engine('hbs', hbsConfig);


async function main() {
    try {
        await sequelize.sync()
        const bot = require('./bot/bot.js')
        app.listen(3000, () => console.log('server alive!'))
        app.use(authChecker)
        app.use(mainRouter)
    }
    catch (err) {
        console.log(err)
    }
}
main()




process.on('uncaughtException', (err) => {
    console.log(err)
})

process.on('SIGINT', async () => {
    await sequelize.close()
    console.log('server dead!')
    process.exit()
})