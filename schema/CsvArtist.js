module.exports = function(sequelize, DataTypes) {
  return sequelize.define("csv_artist", {
    counter: DataTypes.INTEGER,
    first_name: DataTypes.STRING(255),
    last_name: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    artist_image: DataTypes.TEXT,
    address1: DataTypes.TEXT,
    address2: DataTypes.TEXT,
    zipcode: DataTypes.STRING(200),
    phone: DataTypes.STRING(200),
    email: DataTypes.STRING(200),
    mobile: DataTypes.STRING(200),
    facebook: DataTypes.STRING(200),
    twitter: DataTypes.STRING(200),
    tumblr: DataTypes.STRING(200),
    google: DataTypes.STRING(200),
    youtube: DataTypes.STRING(2),
    website: DataTypes.TEXT,
    courses: DataTypes.TEXT,
    schools: DataTypes.TEXT
    
  })
}
