const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan =  require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Initializations
const app = express();
require('./config/passport');

//Settings
app.set('port',process.env.PORT || 3000); //it will connect to the default port or 3000
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: {
        ifEquals: function(arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        ifNotEq: function (a, b, options) {
            if (a != b) { return options.fn(this); }
            return options.inverse(this);
        }
    }
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // le dice al servidor cuando llegue datos, que lo convierta en objeto json
app.use(methodOverride('_method'))
app.use(session({ //configurando la sesion
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Globas Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user = req.user || null;   
    if(req.user) res.locals.role = req.user.role;
    next();
});


//Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/complaints.routes'));
app.use(require('./routes/services.routes'));
app.use(require('./routes/users.routes'));

//Static Files
app.use(express.static(path.join(__dirname,'public')))

module.exports = app;