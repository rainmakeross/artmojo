
/**
 * Module dependencies.
 */

var express = require('express')
    , mailer = require('express-mailer')
    , application = require('./artmojo-app')
    , index = require('./app/controllers/index_controller')
    , booking = require('./app/controllers/bookings_controller')
    , course = require('./app/controllers/courses_controller')
    , coursedesc = require('./app/controllers/coursedescriptions_controller')
    , prospect = require('./app/controllers/prospects_controller')
    , event = require('./app/controllers/events_controller')
    , country = require('./app/controllers/countries_controller')
    , state = require('./app/controllers/states_controller')
    , region = require('./app/controllers/regions_controller')
    , category = require('./app/controllers/categories_controller')
    , subject = require('./app/controllers/subjects_controller')
    , tempartist = require('./app/controllers/tempartists_controller')
    , tempschool = require('./app/controllers/tempschools_controller')
    , page = require('./app/controllers/pages_controller')
    , artist = require('./app/controllers/artists_controller')
    , artistImg = require('./app/controllers/artistimages_controller')
    , artistCredential = require('./app/controllers/artistcredentials_controller')
    , artistVid = require('./app/controllers/artistvideos_controller')
    , artistAud = require('./app/controllers/artistaudios_controller')
    , school = require('./app/controllers/schools_controller')
    , blog = require('./app/controllers/blogs_controller')
    , job = require('./app/controllers/jobs_controller')
    , jobtype = require('./app/controllers/jobtypes_controller')
    , city = require('./app/controllers/cities_controller')
    , user = require('./app/controllers/users_controller')
    , subscriber = require('./app/controllers/subscribers_controller')
    , usertypes = require('./app/controllers/usertypes_controller')
    , paypal_payment = require('./app/controllers/paypal_controller')
    , transaction = require('./app/controllers/transactions_controller')
    , sitemap = require('./app/helpers/sitemap')
    , utils = require('./app/helpers/utils')
    , https = require('https')
    , http = require('http')
    , fs = require('fs')
    , path = require('path')
    , flash = require('connect-flash');

/**
 * SSL set up
 */
var options = {
    key: fs.readFileSync('./test/fixtures/keys/hacksparrow-key.pem'),
    cert: fs.readFileSync('./test/fixtures/keys/hacksparrow-cert.pem')
};

/**
 * Application declaration
 */
var app = express();

/**
 * Express mailer settings
 */
mailer.extend(app, {
    from: 'info@artmojo.co',
    host: 'smtpout.secureserver.net', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: "contact@artmojo.co",
        pass: "123456"
    }
});

/*
 * Scheduler settings
 */
var schedule = require('node-schedule');
var j = schedule.scheduleJob({hour: 0, minute: 01, dayOfWeek: 0}, function(){
    sitemap.generateXMLSiteMap;
});


/**
 * PassportJs settings
 * Setting up passport js authentication method
 */
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , RememberMeStrategy = require('passport-remember-me').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
        //console.log(username);
        //console.log(password);
        var param = { "email": username, "password": password };
        var User = require('./app/models/user');
        User.checkLogin(param, function(user){
            //console.log(user);
            if(!user){
                return done(null, false, { message: 'Incorrect username.' });
            }
            return done(null, user);
        });
    }
));

passport.use(new RememberMeStrategy(
    function(token, done) {
        var Token = require('./app/models/token');
        Token.consume(token, function (user) {

            if (!user) { return done(null, false); }
            return done(null, user);
        });
    },
    function(user, done) {
        var token = "Abcd123Sdrf";
        utils.randomString(64, function(rdStr){
            token = rdStr;
        });
        //res.send(token);
        console.log(token)
        var Token = require('./app/models/token');
        Token.add(token, user.id, function(data) {
            if (data != "Done") { return done(data); }
            return done(null, token);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var user = require('./app/models/user');
    user.getDatabyId(id, function(user){
        //console.log(user);
        done(null, user);
    });
});

/**
 * Setting up the Environmental variables
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
//app.set('models', require('./models'));
//app.use(express.favicon());
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({cookie: { path: '/', httpOnly: false, maxAge: null }, secret:'498f99f3bbee4ae3a075eada02488464'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Enabling proxy
 */
app.enable('trust proxy');

/**
 * Setting up launch modes
 */
if ('development' == app.get('env')) {
    app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
}

/*
 * Router declarations
 */

app.get('/', index.index);
app.post('/search', course.search);
app.get('/search', course.search);

app.get('/artists', artist.index);
app.get('/courses', course.index);
app.get('/schools', school.index);


app.post('/courses/search/filterResults', course.filterResults);
app.get('/courses/results', course.results);
app.get('/courses/autocomplete', course.autocomplete);
app.get('/courses/loadcourses', course.loadcourses);
//app.get('/courses', course.list);
app.get('/courses/view', course.view);
app.get('/courses/showartists', course.showartists);
app.get('/courses/showschools', course.showschools);
app.post('/courses/filterartists', course.filterartists);
app.post('/courses/filterschools', course.filterschools);
app.get('/courses/droplist', course.showListByCategory);
app.get('/courses/droplistbycategory', course.showListByCategory);
app.get('/courses/list', course.show);
app.get('/courses/all', course.all);
app.get('/courses/getsubject', course.getsubject);
app.get('/courses/artistCourses', course.artistCourses);

app.get('/artists/loadmentors', artist.loadmentors);
app.get('/artists/public/add', artist.publicadd);
app.get('/artists/results', artist.results);
app.post('/artists/search/filterResults', artist.filterResults);
//app.get('/artists/', artist.index);
app.get('/artists/view', artist.view);
app.get('/artists/showcourses', artist.showcourses);
app.get('/artists/showinterests', artist.showinterests);
app.get('/artists/showschools', artist.showschools);
app.get('/artists/showreviews', artist.showreviews);
app.post('/artists/public/addreview', artist.addreview);
app.post('/artists/rating', artist.rateArtist);
app.get('/artists/quicklist/publicadd', artist.addtolist);
app.get('/artists/quicklist/list', artist.viewlist);
app.post('/artists/doedit', artist.edit);
app.post('/artists/doeditop', artist.doedit);
app.post('/artists/doadd', artist.doadd);
app.get('/artists/getcourses', artist.getArtistCourses);
app.get('/artists/getinterests', artist.getArtistInterests);
app.get('/artists/fetchImages', artist.fetchImages);
app.get('/artists/makePrivate', artist.makePrivate);
app.get('/artists/makePublic', artist.makePublic);
app.get('/artists/public/chooseaction', artist.chooseaction); //chooseaction

app.get('/artists/view/media', artist.media);

app.get('/artists/myimages', artistImg.myimages);
app.get('/artists/images/all', artistImg.publicAll);
app.get('/artists/loadimages', artistImg.showAll);
app.get('/artists/images/public/add', artistImg.publicadd);
app.post('/artist/image/doaddimage', artistImg.doaddimage);

app.get('/artists/view/credentials', artistCredential.credentials);
app.get('/artists/credentials/all', artistCredential.publicAll);
app.get('/artists/mycredentials', artistCredential.mycredentials);
app.get('/artists/loadcredentials', artistCredential.showAll);
app.get('/artists/credentials/public/add', artistCredential.publicadd);
app.post('/artist/credential/doaddcredential', artistCredential.doaddcredential);
app.get('/artists/credentials/droplist', artistCredential.getcredentials)

app.get('/artists/myvideos', artistVid.myvideos);
app.get('/artists/loadvideos', artistVid.showAll);
app.get('/artists/videos/all', artistVid.publicAll);
app.get('/artists/videos/public/add', artistVid.publicadd);
app.post('/artist/video/doaddvideo', artistVid.doaddvideo);

app.get('/artists/myaudios', artistAud.myaudios);
app.get('/artists/loadaudios', artistAud.showAll);
app.get('/artists/audios/all', artistAud.publicAll);
app.get('/artists/audios/public/add', artistAud.publicadd);
app.post('/artist/audio/doaddaudio', artistAud.doaddaudio);

app.get('/blogs', blog.index);
app.get('/blogs/loadBlogs', blog.loadBlogs);
app.get('/blogs/public/add', blog.publicadd);
app.get('/blogs/public/edit', blog.publicedit);
app.get('/blogs/view', blog.view);
app.post('/blogs/doaddblog', blog.doadd);
app.post('/blogs/doeditblog', blog.doedit);
app.get('/blogs/loadSample', blog.loadSample);
app.get('/blogs/showreviews', blog.showreviews);
app.post('/blogs/public/addreview', blog.addreview);
app.post('/blogs/rating', blog.rateBlog);

app.get('/jobtypes/droplist', jobtype.list);

app.get('/jobs', job.index);
app.get('/jobs/loadJobs', job.loadJobList);
app.get('/jobs/loadEjobs', job.loadjobs);
app.get('/jobs/public/add', job.publicadd);
app.post('/jobs/doaddjob', job.doaddjob);
app.get('/jobs/public/edit', job.publicedit);
app.post('/jobs/doeditjob', job.doeditjob);
app.get('/jobs/results', job.results);
app.get('/jobs/view', job.view);
app.get('/jobs/fetchImages', job.fetchImages);
app.post('/jobs/search/filterResults', job.filterResults);


//app.get('/tempartists/public/add', tempartist.publicadd);
//app.get('/tempartists/public/edit', tempartist.publicedit); //chooseaction
//app.get('/tempartists/public/chooseaction', tempartist.chooseaction); //chooseaction
//app.post('/tempartists/add', tempartist.add);
//app.post('/tempartists/edit', tempartist.edit);

/*app.get('/tempschools/public/add', tempschool.publicadd);
 app.get('/tempschools/public/edit', tempschool.publicedit);
 app.get('/tempschools/public/chooseaction', tempschool.chooseaction); //chooseaction
 app.post('/tempschools/add', tempschool.add);
 app.post('/tempschools/edit', tempschool.edit);*/

app.get('/schools/loadschools', school.loadschools);
app.get('/schools/results', school.results);
app.get('/schools/names', school.getNames);
app.post('/schools/search/filterResults', school.filterResults);
app.get('/schools/view', school.view);
app.get('/schools/showcourses', school.showcourses);
app.get('/schools/showartists', school.showartists);
app.get('/schools/showreviews', school.showreviews);
app.post('/schools/public/addreview', school.addreview);
app.post('/schools/rating', school.rateSchool);
app.get('/schools/quicklist/publicadd', school.addtolist);
app.get('/schools/quicklist/list', school.viewlist);
app.get('/schools/getcourses', school.getcourses);
app.get('/schools/fetchImages', school.fetchImages);
app.post('/schools/doadd', school.doadd);
//app.post('/schools/doedit', school.edit);
app.post('/schools/doeditop', school.doedit);
app.get('/countries', country.list);
app.get('/countries/list', country.list);
app.get('/countries/droplist', country.list);

app.get('/states/listone', state.show);
app.get('/states/droplistbycountry', state.show);

app.get('/cities/autocomplete', city.autocomplete);
app.get('/cities/list', city.list);
app.get('/cities/droplist', city.list);
app.get('/cities/droplistbystate', city.show);
app.get('/cities/listone', city.show);

app.get('/category/list', category.list);
app.get('/categories/droplist', category.list);
app.get('/categories/list', category.list);

app.get('/events', event.index);
app.get('/events/listEvents', event.listEvents);
app.get('/events/view', event.view);
app.get('/events/public/add', event.publicadd);
app.get('/events/public/edit', event.publicedit);
app.post('/events/doaddevent', event.doaddevent);
app.post('/events/doeditevent', event.doeditevent);
app.get('/events/delete', event.remove);
app.get('/events/loadevents', event.loadevents);
app.get('/events/fetchImages', event.fetchImages);
app.get('/events/results', event.results);
app.post('/events/search/filterResults', event.filterResults);

app.get('/terms', page.terms);
app.get('/contact', page.contact);
app.post('/pages/doContact', page.doContact);
app.get('/faq', page.faq);
app.get('/privacy', page.privacy);
app.get('/about', page.about);
app.get('/legal', page.legal);
app.get('/geoip', page.geoip);

app.get('/login', user.login);
app.get('/logout', user.logout);
app.get('/signup', user.signup);
app.get('/users/verify', user.resendVerify);
app.post('/users/resendToken', user.resendToken);
app.post('/users/doedit', user.doedit);
app.get('/users/verifytoken', user.verifytoken);
app.get('/users/editprofile', user.editprofile);
app.get('/users/editlogininfo', user.editlogininfo);
app.get('/users/artists/list', user.artistlist);
app.get('/users/schools/list', user.schoollist);

/*app.post('/users/dologin',
 passport.authenticate('local', { successRedirect: '/',
 failureRedirect: '/login',
 failureFlash: false })
 );*/
app.use(flash());
app.post('/users/dologin',
    passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login?lm=0', failureFlash: false }),
    function(req, res, next) {
        // issue a remember me cookie if the option was checked
        if (!req.body.remember_me) { return next(); }

        var token = "Abcd123Sdrf";
        utils.randomString(64, function(rdStr){
            token = rdStr;
        });
        var Token = require('./app/models/token');
        Token.add(token, req.user.id, function(data) {
            if (data != "Done") { return res.send(data); }
            res.cookie('remember_me', token, { path: '/', httpOnly: false, maxAge: 604800000 }); // 7 days
            return next();
        });
    },
    function(req, res) {
        res.redirect('/');
    });
app.post('/users/dosignup', user.dosignup);
app.get('/profile', user.profile);
app.get('/resetpassword', user.resetpassword);
app.post('/users/sendpassword', user.sendpassword);

//app.get('/sitemap-1.xml.gz', sitemap.generateXMLSiteMap);
//app.get('/sitemap', sitemap.generateXMLSiteMap);

app.post('/newsletter/subscribe', subscriber.subscribe);

//operator links
app.get('/myartists', artist.mylist);
app.get('/myschools', school.mylist);
app.get('/myevents', event.mylist);
app.get('/myjobs', job.mylist);
app.get('/opevents', event.opevents);
app.get('/opjobs', job.opjobs);
//app.get('/alljobs', job.alllist);
app.get('/jobs/loadMyJobs', job.loadMyJobs);
app.get('/schools/loadMySchools', school.loadMySchools);
app.get('/artists/loadMyArtists', artist.loadMyArtists);
app.get('/events/loadMyEvents', event.loadMyEvents);
//app.get('/jobs/loadAllJobs', job.loadAllJobs);
app.get('/artists/operator/add', artist.operatoradd);
app.get('/artists/operator/edit', artist.operatoredit);
app.get('/schools/operator/add', school.operatoradd);
app.get('/schools/operator/edit', school.operatoredit);
app.get('/jobs/operator/add', job.operatoradd);
app.get('/jobs/operator/edit', job.operatoredit);
app.post('/jobs/doaddjobop', job.doaddjobop);
app.post('/jobs/doeditjobop', job.doeditjobop);
app.get('/events/operator/add', event.operatoradd);
app.get('/events/operator/edit', event.operatoredit);
app.post('/events/doaddeventop', event.doaddeventop);
app.post('/events/doediteventop', event.doediteventop);
//admin links
app.get('/allcountries', country.all);
app.get('/country/listall', country.listall);
app.get('/country/publicadd', country.publicadd);
app.get('/country/publicedit', country.publicedit);
app.post('/country/doadd', country.doadd);
app.post('/country/doedit', country.doedit);

app.get('/allstates', state.all);
app.get('/states/listall', state.listall);
app.get('/states/public/add', state.publicadd);
app.get('/states/public/edit', state.publicedit);
app.post('/states/doadd', state.doadd);
app.post('/states/doedit', state.doedit);

app.get('/allcategories', category.all);
app.get('/category/listall', category.listall);
app.get('/category/publicadd', category.publicadd);
app.get('/category/publicedit', category.publicedit);
app.post('/category/doadd', category.doadd);
app.post('/category/doedit', category.doedit);

app.get('/allcourses', course.full);
app.get('/courses/listall', course.listall);
app.get('/courses/public/add', course.publicadd);
app.get('/courses/public/edit', course.publicedit);
app.post('/courses/doadd', course.doadd);
app.post('/courses/doedit', course.doedit);

/*app.get('/allsubjects', subject.all);
 app.get('/subjects/listall', subject.listall);
 app.get('/subjects/public/add', subject.publicadd);
 app.get('/subjects/public/edit', subject.publicedit);
 app.post('/subjects/doadd', subject.doadd);
 app.post('/subjects/doedit', subject.doedit);*/

app.get('/allartists', artist.all);
app.get('/artists/listall', artist.listall);
app.get('/allschools', school.all);
app.get('/schools/listall', school.listall);
app.get('/allevents', event.all);
app.get('/events/listall', event.listall);
app.get('/alljobs', job.all);
app.get('/jobs/listall', job.listall);

app.get('/allusers', user.all);
app.get('/users/listall', user.listall);
app.get('/users/publicadd', user.publicadd);
app.get('/users/publicedit', user.publicedit);
app.post('/users/doaddlist', user.doaddlist);
app.post('/users/doeditlist', user.doeditlist);

app.get('/allbookings', booking.all);
app.get('/bookings/listall', booking.listall);
app.get('/mybookings', booking.mylist);
app.get('/bookings/loadMyBookings', booking.loadMyBookings);
app.get('/bookings/requests', booking.requests);
app.get('/bookings/loadRequests', booking.loadRequests);
app.get('/bookings/confirmed', booking.confirmed);
app.get('/bookings/loadConfirmeds', booking.loadMyBookings); ///bookings/accept

app.get('/bookings/add', booking.publicadd);
app.post('/bookings/doadd', booking.doadd);
app.get('/bookings/accept', booking.accept);
app.post('/bookings/doaccept', booking.doaccept);

app.get('/bookings/paynow', booking.paynow);

app.get('/payments/checkout', paypal_payment.checkout);
app.get('/payments/confirm', paypal_payment.confirm);
app.get('/payments/cancel', paypal_payment.cancel);

app.get('/alltransactions', transaction.all);
app.get('/transactions/listall', transaction.listall);

// Image Fetch Manual Run URL
app.get('/artist/fetchImage', artist.fetchImages);
app.get('/school/fetchImage', school.fetchImages);
app.get('/event/fetchImage', event.fetchImages);
app.get('/job/fetchImage', job.fetchImages);

// SiteMap Manual Generation URL
app.get('/secret/siteMapGenerate', sitemap.generateXMLSiteMap);
/*
 * always make that 404 as the last route
 * otherwise it will make routes below to stop functioning
 * as node.js works linearly


 app.get('*', function(req, res){
 res.send('what???', 404);
 });
 */


// Testing Routines
app.get('/test/checklogin',user.doCheckLogin);

app.get('/artists/view/*', function(req, res){
    res.send('what???', 404);
});

app.get('/schools/view/*', function(req, res){
    res.send('what???', 404);
});

/*http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });*/

https.createServer(options, app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
