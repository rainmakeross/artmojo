module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    id: DataTypes.INTEGER,
    user_typeId: DataTypes.INTEGER,
    first_name: DataTypes.STRING(50),
    last_name: DataTypes.STRING(50),
    full_name: DataTypes.STRING(255),
    address_line_1: DataTypes.STRING(50),
    address_line_2: DataTypes.STRING(50),
    zip_code: DataTypes.STRING(50),
    phone_number: DataTypes.STRING(50),
    access_token: DataTypes.STRING,
    password: DataTypes.STRING(50),
    email: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN,
    is_newsletter: DataTypes.BOOLEAN
  });
  
}





