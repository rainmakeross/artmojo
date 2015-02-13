module.exports = function(sequelize, DataTypes) {
  return sequelize.define("school", {
    counter: DataTypes.INTEGER,
    school_name: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    school_image: DataTypes.STRING(255),
    address: DataTypes.TEXT,
    zipcode: DataTypes.STRING(100),
    phone: DataTypes.STRING(200),
    email: DataTypes.STRING(200),
    facebook: DataTypes.STRING(255),
    twitter: DataTypes.STRING(255),
    tumblr: DataTypes.STRING(255),
    google: DataTypes.STRING(255),
    youtube: DataTypes.STRING(255),
    website: DataTypes.STRING(255),
    courses: DataTypes.TEXT,
    artists: DataTypes.TEXT
    
  })
}
