module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    last_name: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    full_name: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    artist_image: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    address1: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    address2: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    zipcode: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    phone: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    email: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    mobile: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    facebook: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    twitter: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    tumblr: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    google: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    youtube: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    website: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null},
    active: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    number_of_views: { type: DataTypes.BIGINT, defaultValue: 1 },
    total_rate: { type: DataTypes.INTEGER, defaultValue: 0 },
    meta_keyword: { type: DataTypes.TEXT, allowNull: true, defaultValue: null},
    email_sent: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    total_comments: { type: DataTypes.INTEGER, defaultValue: 0 },
    localImg: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    profile_status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    image_url: { type: DataTypes.TEXT, allowNull: true, defaultValue: null}
  })
}
