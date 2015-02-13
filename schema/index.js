
var Sequelize = require('sequelize');
var config = require('../config/config');
var sequelize = new Sequelize(config.database, config.username, config.password, {
  // custom host; default: localhost
  host: config.host,

  // custom port; default: 3306
  port: 3306,
  // disable logging; default: console.log
  logging: false,

  // max concurrent database requests; default: 50
  maxConcurrentQueries: 100,

  // the sql dialect of the database
  // - default is 'mysql'
  // - currently supported: 'mysql', 'sqlite', 'postgres'
  dialect: config.dialect,

  rand: function() {
    return parseInt(Math.random() * 999)
  },
  // use pooling in order to reduce db connection overload and to increase speed
  // currently only for mysql and postgresql (since v1.5.0)
  pool: { maxConnections: 5, maxIdleTime: 30}
});


/*
var Sequelize = require('sequelize')
  , config    = require("../config/config")
  , sequelize = new Sequelize(config.database, config.username, config.password, {logging: false})
*/

//load models
var models = [
    'Artist',
    'ArtistComment',
    'ArtistCourse',
    'ArtistQuicklist',
    'ArtistRating',
    'ArtistImage',
    'ArtistVideo',
    'ArtistAudio',
    'ArtistSchool',
    'ArtistCredential',
    'Blog',
    'BlogRating',
    'BlogComment',
    'Booking',
    'Category',
    'City',
    'Country',
    'Course',
    'CourseDescription',
    'CourseRating',
    'CsvArtist',
    'CsvSchool',
    'Event',
    'Job',
    'JobType',
    'PasswordReset',
    'Prospect',
    'Region',
    'School',
    'SchoolComment',
    'SchoolCourse',
    'SchoolQuicklist',
    'SchoolRating',
    'State',
    'Subject',
    'Subscriber',
    'TempArtist',
    'TempSchool',
    'Token',
    'User',
    'UserType'
]
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});
// describe relationships
(function(m) {
    m.Artist.belongsTo(m.Region);
    m.Artist.belongsTo(m.City);
    m.Artist.hasMany(m.ArtistComment);
    m.Artist.hasMany(m.ArtistCourse);
    m.Artist.hasMany(m.ArtistQuicklist);
    m.Artist.hasMany(m.ArtistRating);
    m.Artist.hasMany(m.ArtistSchool);
    m.Artist.hasMany(m.ArtistImage);
    m.Artist.hasMany(m.ArtistVideo);
    m.Artist.hasMany(m.ArtistAudio);
    m.Artist.hasMany(m.TempArtist);
    
    m.ArtistImage.belongsTo(m.Artist);
    m.ArtistVideo.belongsTo(m.Artist);
    m.ArtistAudio.belongsTo(m.Artist);
    
    m.ArtistComment.belongsTo(m.Artist);
    m.ArtistComment.belongsTo(m.User);
    
    m.ArtistCourse.belongsTo(m.Artist);
    m.ArtistCourse.belongsTo(m.Course);
    
    m.ArtistQuicklist.belongsTo(m.Artist);
    m.ArtistQuicklist.belongsTo(m.User);
    
    m.ArtistRating.belongsTo(m.Artist);
    m.ArtistRating.belongsTo(m.User);
    
    m.ArtistSchool.belongsTo(m.Artist);
    m.ArtistSchool.belongsTo(m.School);
    
    m.Category.hasMany(m.Course);
    m.Category.hasMany(m.Event);
    
    m.City.belongsTo(m.State);
    m.City.hasMany(m.User);
    m.City.hasMany(m.Artist);
    m.City.hasMany(m.School);
    m.City.hasMany(m.Region);
    m.City.hasMany(m.CsvArtist);
    m.City.hasMany(m.CsvSchool);
    m.City.hasMany(m.Event);
    m.City.hasMany(m.Job);
    m.City.hasMany(m.TempArtist);
    m.City.hasMany(m.TempSchool);
    
    m.Country.hasMany(m.User);
    m.Country.hasMany(m.State);
    m.Country.hasMany(m.CsvArtist);
    m.Country.hasMany(m.CsvSchool);
    m.Country.hasMany(m.Event);
    m.Country.hasMany(m.TempArtist);
    m.Country.hasMany(m.TempSchool);
    
    m.Course.belongsTo(m.Category);
    m.Course.belongsTo(m.CourseDescription);
    m.Course.hasMany(m.Subject);
    m.Course.hasMany(m.ArtistCourse);
    m.Course.hasMany(m.SchoolCourse);
    m.Course.hasMany(m.CourseRating);
    
    m.CourseDescription.hasMany(m.Course);
    
    m.CourseRating.belongsTo(m.Course);
    m.CourseRating.belongsTo(m.User);
    
    m.CsvArtist.belongsTo(m.Region);
    m.CsvArtist.belongsTo(m.City);
    m.CsvArtist.belongsTo(m.State);
    m.CsvArtist.belongsTo(m.Country);
    
    m.CsvSchool.belongsTo(m.Region);
    m.CsvSchool.belongsTo(m.City);
    m.CsvSchool.belongsTo(m.State);
    m.CsvSchool.belongsTo(m.Country);
    
    m.Event.belongsTo(m.User);
    m.Event.belongsTo(m.City);
    m.Event.belongsTo(m.Country);
    m.Event.belongsTo(m.Category);
    
    m.PasswordReset.belongsTo(m.User);
    
    m.Prospect.belongsTo(m.User);
    
    m.Region.belongsTo(m.City);
    m.Region.hasMany(m.Artist);
    m.Region.hasMany(m.School);
    m.Region.hasMany(m.TempArtist);
    m.Region.hasMany(m.TempSchool);
    
    m.School.belongsTo(m.Region);
    m.School.belongsTo(m.City);
    m.School.hasMany(m.SchoolComment);
    m.School.hasMany(m.SchoolCourse);
    m.School.hasMany(m.SchoolQuicklist);
    m.School.hasMany(m.SchoolRating);
    m.School.hasMany(m.ArtistSchool);
    m.School.hasMany(m.TempSchool);
    
    m.SchoolComment.belongsTo(m.School);
    m.SchoolComment.belongsTo(m.User);
    
    m.SchoolCourse.belongsTo(m.School);
    m.SchoolCourse.belongsTo(m.Course);
    
    m.SchoolQuicklist.belongsTo(m.School);
    m.SchoolQuicklist.belongsTo(m.User);
    
    m.SchoolRating.belongsTo(m.School);
    m.SchoolRating.belongsTo(m.User);
    
    m.State.belongsTo(m.Country);
    m.State.hasMany(m.User);
    m.State.hasMany(m.City);
    m.State.hasMany(m.CsvArtist);
    m.State.hasMany(m.CsvSchool);
    m.State.hasMany(m.TempArtist);
    m.State.hasMany(m.TempSchool);
    
    m.Subject.belongsTo(m.Course);
    
    m.TempArtist.belongsTo(m.Region);
    m.TempArtist.belongsTo(m.City);
    m.TempArtist.belongsTo(m.State);
    m.TempArtist.belongsTo(m.Country);
    m.TempArtist.belongsTo(m.Artist);
    
    m.TempSchool.belongsTo(m.Region);
    m.TempSchool.belongsTo(m.City);
    m.TempSchool.belongsTo(m.State);
    m.TempSchool.belongsTo(m.Country);
    m.TempSchool.belongsTo(m.School);    
    
    m.User.belongsTo(m.UserType);
    m.User.belongsTo(m.City);
    m.User.belongsTo(m.State);
    m.User.belongsTo(m.Country);
    m.User.hasMany(m.PasswordReset);
    m.User.hasMany(m.Prospect);
    m.User.hasMany(m.ArtistComment);
    m.User.hasMany(m.ArtistRating);
    m.User.hasMany(m.ArtistQuicklist);
    m.User.hasMany(m.Event);
    m.User.hasMany(m.SchoolComment);
    m.User.hasMany(m.SchoolRating);
    m.User.hasMany(m.SchoolQuicklist);
    m.User.hasMany(m.CourseRating);   
    m.User.hasMany(m.Token); 
    
    m.UserType.hasMany(m.User);    
    
    m.JobType.hasMany(m.Job); 
    
    m.Job.belongsTo(m.JobType);
    m.Job.belongsTo(m.City);
    
    
})(module.exports);
// export connection
module.exports.sequelize = sequelize;
