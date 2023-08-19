const express = require('express');
const environment = require('./config/environment');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8000;
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const customMware = require('./config/flashMessageMiddleware');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views')
const db = require(environment.db_path);
const session = require('express-session');
const passport = require('passport');
const passportLocal = require(environment.passport_local_path);
const MongoStore = require('connect-mongo');

app.use(expressLayouts);

app.use(session({
    name: 'employeereview',
    secret: environment.secret_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongoUrl :environment.mongoose_connect,
        autoRemve:'interval',
        autoRemoveInterval:'1'
    }),function(error){
        console.log(err || 'connect-mongo setup ok')
    }
}));

app.use(passport.initialize());
app.use(passport.session());
//now tell the app to use  static files
app.use(express.static(environment.assets_path));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(flash());
app.use(customMware.setFlash)
app.use('/', require('./routes/index'));
app.listen(port, function (error) {
    if (error) {
        console.log("Error while creating server !!");
    } else {
        console.log("server is running !!");
    }
})