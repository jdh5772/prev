const bcrypt = require("bcrypt");

exports.isSamePassword = async (dbPassword,inputPassword)=>{
    const compared = await bcrypt.compare(dbPassword,inputPassword);
    return compared;
}