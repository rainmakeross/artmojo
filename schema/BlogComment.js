module.exports = function(sequelize, DataTypes) {
  return sequelize.define("blog_comment", {
    blogId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comments: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  })
}
