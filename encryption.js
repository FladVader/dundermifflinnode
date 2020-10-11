const bcrypt = require('bcrypt');
const saltNum = 10;


//Krypterar lösenordet och genererar en hash
const generatePassword = async (password) => {

    const salt = await bcrypt.genSalt(saltNum);
    const hash = await bcrypt.hash(password, salt);
    console.log(hash);
    
    return hash;
};

//Jämför login-lösen med den hash som finns i tabellen
const comparePassword = async (password, hash) => {

    try{

    const match = await bcrypt.compare(password, hash);
    
    return match; 
    }
    catch(error) {
        console.log(error);
        return error;
    };
};


module.exports = {generatePassword, comparePassword, bcrypt};