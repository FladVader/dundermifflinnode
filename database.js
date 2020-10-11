const Promise = require('bluebird');
const sqlite = require('sqlite');
const dbCon = sqlite.open('./appdb.db', { Promise });
const encryption = require('./encryption');

const getUsers = async () => {
    try {
        const db = await dbCon;
        const users = await db.all('SELECT * FROM users ORDER BY id ASC');
        if (users.length != 0) {
            console.log(users);
            console.log('this is database.js responding');
            return users;
        }
        else {
            throw Error('Något gick fel!');
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

const getUs = async (id) => {
    try {
        const db = await dbCon;
        const user = await db.get('SELECT * FROM `users` WHERE id =?', id);
        if (user) {
            return user;
        }
        else {
            throw Error('Något gick fel!');
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

const addUser = async (newUser) => {
    try {
        const db = await dbCon;

        await db.all('INSERT INTO `users` (firstname, lastname, email, password) VALUES ( ?, ?, ?, ?)',
            [newUser.firstname, newUser.lastname, newUser.email, await encryption.generatePassword(newUser.password)]);

        return 'Användare tillagd!';
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteUser = async (delUser) => {
    try {
        const db = await dbCon;
        console.log(delUser);
        const user = await db.get('SELECT * FROM `users` WHERE id =?', delUser.id);

        if (user) {
            await db.all('DELETE FROM `users` WHERE id=?', user.id);
            return 'Användare raderad!';
        }
        else {
            throw Error ('Användaren kunde inte hittas!');
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    };
};

const addProd = async (pname, description, price, img, category) => {

    try {

        const db = await dbCon;
        await db.all('INSERT INTO `products_dm` (pname, description, price, img, category) VALUES (?, ?, ?, ?, ?)',
            [pname, description, price, img, category]);

        return 'Produkt tillagd!'
    }
    catch (error) {
        console.log(error);
        throw error;
    };
};

const updateProd = async (id, pname, description, price, img, category) => {

    try {
        const db = await dbCon;
        const checkId = await db.get('SELECT * FROM products_dm WHERE id=?', id);
        //Kollar så att det id som användaren skickar in matchar en produkt i tabellen
        if (checkId) {
            const product = await db.get('UPDATE products_dm SET pname=?, description=?, price=?, img=?, category=?  WHERE id=?',
                pname, description, price, img, category, id);
            return product;
        }
        else {
            throw Error('Något gick fel!');
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteProd = async (delProd) => {

    try {
        const db = await dbCon;
        console.log(delProd);
        const product = await db.get('SELECT * FROM products_dm WHERE id=?', delProd.id);

        if (product) {
            await db.get('DELETE FROM `products_dm` WHERE id=?', product.id);
            return 'Produkt raderad!';
        }

        else {
            throw Error('Något gick fel!')
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    };
};

const getProducts = async () => {
    try {
        const db = await dbCon;
        const products = await db.all('SELECT * FROM products_dm ORDER BY id ASC');
        console.log(products);
        return products;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

const getProd = async (id) => {
    try {
        const db = await dbCon;
        const prod = await db.get('SELECT * FROM `products_dm` WHERE id =?', id);
        if (prod) {

            console.log(prod)

            return prod;
        }
        else {
            throw Error('Något gick fel!');
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

//Hämtar lösenord från tabellen baserat på användarens email-adress
const getPassword = async (find) => {
    try {
        const db = await dbCon;
        const user = await db.get('SELECT password FROM `users` WHERE email =?', find.email);
        if (user) {
            return user;
        }
        else {
            throw Error('Något gick fel!');
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = { getPassword, deleteUser, getUsers, getProducts, getProd, getUs, addProd, deleteProd, addUser, updateProd };