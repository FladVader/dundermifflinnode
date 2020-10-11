const express = require('express');
const routes = express.Router();
const database = require('./database')
const encryption = require('./encryption');
const bcrypt = require('bcrypt');
// const cors = require('cors');
// routes.use(cors);
routes.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
// const bodyParser = require('body-parser');
// routes.use(
//     bodyParser.urlencoded({
//         extended: true
//     })
// );

// routes.use(bodyParser.json());

routes.use(express.json());



//function FÖRE (req, res), eller => EFTER (req, res)
//Använd AWAIT före funktionen kallas för att få ett return-värde
routes.get('/getusers', async function(req, res) {
    try {

        const users = await database.getUsers();

        console.log('This is routes.js responding');
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(400).json('Användare hittades inte!')
    }
});

routes.get('/getproducts', async(req, res, next) => {
    try {
        const products = await database.getProducts();
        console.log('This is routes.js responding');

        //OBS: CORS, fråga lärare
        res.header('Access-Control-Allow-Origin', '*');
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(400).json('Produkterna kunde inte hämtas!')
    }
});

//Bara ett test för att skicka en html-fil
// routes.get('/html', (req, res) => {
//     res.sendFile('./test.html', { root: __dirname });
// });

routes.get('/getprod/:id/', async(req, res) => {
    try {
        const prod = req.params.id;

        console.log(prod);
        const found = await database.getProd(prod);
        res.json(found);
    } catch (error) {
        console.log(error)
        res.status(400).json('Produkten hittades inte!')
    }
});

routes.get('/getus/:id/', async(req, res) => {
    try {
        const user = await database.getUs(req.params.id);
        res.json(user);
    } catch (error) {
        console.log(error)
        res.status(400).json('Användare hittades inte!')
    }
});

routes.post('/addproduct/', async(req, res) => {
    try {
        // const newProd = await (req.body);
        const newProd = req.body;
        newProd.pname = req.body.pname;
        newProd.description = req.body.description;
        newProd.price = req.body.price;
        newProd.img = req.body.img;
        newProd.category = req.body.category;

        res.header('Access-Control-Allow-Origin', '*');


        if (newProd.pname && newProd.description && newProd.price) {

            await database.addProd(newProd.pname, newProd.description, newProd.price, newProd.img, newProd.category);
            res.status(200).json(newProd + ' Produkt tillagt!');
        } else {
            console.log(newProd)
            throw Error('Skriv in korrekt information!')
        }
    } catch (error) {
        console.log(error)
        res.status(400).json('Produkten kunde inte läggas till!')
    }
});

routes.post('/updateproduct/', async(req, res) => {
    try {
        const product = req.body;
        product.pname = req.body.pname;
        product.description = req.body.description;
        product.price = req.body.price;
        product.img = req.body.img;
        product.category = req.body.category;
        //Kollar så att användaren har fyllt i samtliga värden
        if (product.id && product.pname && product.description && product.price) {
            const updated = await database.updateProd(product.id, product.pname, product.description, product.price, product.img, product.category);
            res.json('uppdaterad produkt!');
        } else {
            throw Error('Skriv in korrekt information!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json('Produkten kunde inte uppdateras!')
    }
})

routes.post('/adduser/', async(req, res) => {

    try {
        const newUser = req.body;
        if (newUser.firstname && newUser.lastname && newUser.email && newUser.password) {
            if (newUser.firstname.match(/[^a-ö]/gmi) | newUser.lastname.match(/[^a-ö]/gmi)) {

                res.status(400).json('inga siffror i för- och efternamn!')
            } else {
                await database.addUser(req.body);
                res.json(newUser);
            }
        } else {

            res.status(400).send('Skriv in korrekt information!')
        }
    } catch (error) {
        console.log(error)
        res.status(400).json('SQLITE-constraint: Mailadressen är redan registrerad!')
    }
});

routes.delete('/deleteproduct/', async(req, res) => {
    try {
        const delProd = await database.deleteProd(req.body);
        delProd.id = req.body.id;
        res.json("Produkten borttagen!");
    } catch (error) {
        console.log(error)
        res.status(400).json('Produkten hittades inte!')
    }
});

routes.delete('/deleteuser/', async(req, res) => {
    try {
        const delUser = await database.deleteUser(req.body);
        res.json(delUser);
    } catch (error) {
        console.log(error)
        res.status(400).json('Användaren hittades inte!')
    }
});

routes.post('/login/', async(req, res) => {
    try {
        const userLogin = req.body;
        const userPass = userLogin.password;
        const user = await database.getPassword(userLogin);
        const validate = await encryption.comparePassword(userPass, (user.password));

        if (validate == true) {
            res.json(validate);
        } else {
            throw Error
        }
    } catch (error) {
        console.log(error)
        res.status(400).send('Det gick inte att logga in!')
    }
});


module.exports = routes;