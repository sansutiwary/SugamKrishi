const express = require('express');
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const authen = require('./config/mongoose');
const DB = require('./models/user');
const port = 8000;

// use for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const CustomMware = require('./config/middleware');

app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    outputStyle : 'extended',
    debug : false,
    prefix : '/css',
}))
app.use(express.static('assets'));
app.use(express.urlencoded());


app.use(cookieParser());
app.use(expressEjsLayout);


app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    name: 'user_id',
    // TODO change secret
    secret: 'jerryjerry',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store : MongoStore.create(
        {
            mongoUrl : 'mongodb://localhost/SugamKrishi',
            autoRemove : 'disabled'
        },
        function(err){
            console.log(err || "connect MongoDB setUp");
        }
    )
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash())
app.use(CustomMware.setFlash);
 
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log("Error listening to port:", port);
        return;
    }
    console.log("Listening to PORT:", port);
});