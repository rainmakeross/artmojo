module.exports = function(sequelize, DataTypes) {
  return sequelize.define("artist_credential", {
    artistId: DataTypes.INTEGER,
    credentialId: DataTypes.INTEGER,
    title: DataTypes.STRING(255),
    role: DataTypes.STRING(255),
    production: DataTypes.STRING(255),
  })
}
