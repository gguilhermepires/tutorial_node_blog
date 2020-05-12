//npm install express-session --save
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database')
const session = require("express-session");
const bcrypt = require("bcryptjs");

const adminAth = require("./middlewares/adminAuth");

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');


const Category = require('./categories/Category');
const Article = require('./articles/Article');
const User = require('./users/User');

const porta = 3002;
const app = express();

//view engine
app.set('view engine', 'ejs');
//sessões
app.use(session({
    secret: "minhapalavrachave",
    cookie: {
       // maxAge:   12*60*60 * 1000
        maxAge:   12*60*60  * 1000
    }
}));

//arquivos estaticos
app.use(express.static('public'));
//body parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection
    .authenticate().then(() => {
        console.log("sucesso");

    }).catch(e => {
        console.log(e);

    })

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);


app.get('/session', (req, res) => {
    req.session.campoTeste1 = "asdad";
    req.session.campoTeste2 = 1;
    req.session.campoTeste3 = { teste: "ola" };
    res.send("salvo");
});

app.get('/leitura', (req, res) => {
    res.json({
        campo1: req.session.campoTeste,
        campo2: req.session.campoTeste2,
        campo3: req.session.campoTeste3,
    })

});

app.get('/', (req, res) => {
    var limitArticlePerPage = 4
    Article.findAll({
        order: [['id', 'DESC']],
        limit: limitArticlePerPage
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: { slug: slug }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories });
            });

        } else {
            res.redirect("/");
        }
    }).catch(e => {
        res.redirect("/");
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: { slug: slug },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories: categories })
            });

        } else {
            res.redirect('/');
        }

    }).catch(e => {
        res.redirect('/');
    });
});

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("t", salt);

User.findOne({where:{email:"adm@gmail.com"}}).then(u=>{
    if(u == undefined){
        User.create({
            email:"adm@gmail.com",
            password:hash
        }).then(u=>{
            console.log(u);
        })
    }
})

app.listen(porta, () => {
    console.log("servidor rodando na porta: " + porta + " hora inicio:" + new Date())
})