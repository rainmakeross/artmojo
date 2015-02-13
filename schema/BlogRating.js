module.exports = function(sequelize, DataTypes) {
  return sequelize.define("blog_rating", {
    blogId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    vote: DataTypes.INTEGER
  })
}
