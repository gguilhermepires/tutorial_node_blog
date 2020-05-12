const express = require("express");
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("./admin/articles/index", {
                articles: articles, categories: categories
            });
        });
    });
});

router.get("/admin/articles/new", adminAth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("./admin/articles/new", {
            categories: categories
        });
    }).catch(e => {
        res.render("./admin/articles/new", {
            categories: null
        });
    })
});

router.post("/admin/articles/save",adminAth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categorieId: category
    }).then(_ => {
        res.redirect('/admin/articles')
    }).catch(e => {
        res.redirect('/admin/articles')
    });

});
router.post("/admin/articles/delete", adminAth,(req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        //verifica se é um número
        if (!isNaN(id)) {

            Article.destroy({ where: { id: id } }).then(e => {
                res.redirect('/admin/articles')
            }).catch(e => {
                res.redirect('/admin/articles')
            })

        } else {
            res.redirect('/admin/articles')
        }
    } else {
        res.redirect('/admin/articles')
    }
});


router.get("/admin/articles/edit/:id",adminAth, (req, res) => {
    var id = req.params.id;
    Article.findByPk(id).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article: article, categories: categories });
            })

        } else {
            res.redirect('/');
        }
    }).catch(e => {
        res.redirect('/');
    });

});
router.post("/admin/articles/update",adminAth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({ title: title, body: body, categoryId: category, slug: slugify(title) },
        {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/articles");
        }).catch(e => {
            res.redirect("/");
        });
});


router.get("/articles/page/:num", (req, res) => {

    var page = req.params.num;
    var quantityPerPage = 4;
    var offset = 0;
    var next;

    Category.findAll().then(categories => {

        Article.findAndCountAll(
            {
                limit: quantityPerPage
            }
        ).then(r => {

            if (parseInt(page) * quantityPerPage > r.count) {
                next = false;
                offset = parseInt(r.count / quantityPerPage);
                offset = offset * quantityPerPage;
                next = false;
                Article.findAndCountAll(
                    {
                        limit: quantityPerPage,
                        offset: offset,
                        order: [['id', 'DESC']],
                    }
                ).then(articles => {
                    var result = {
                        page:parseInt(page),
                        next: next,
                        articles: articles
                    }
                    res.render("./admin/articles/page", { result: result, categories: categories });

                })

            } else {

                if (isNaN(page) || page == "1") {
                    offset = 0;
                }
                Article.findAndCountAll(
                    {
                        limit: quantityPerPage,
                        offset: offset,
                        order: [['id', 'DESC']],
                    }
                ).then(articles => {

                    if (articles.count > quantityPerPage)
                        next = true;
                    else
                        next = false;

                    var result = {
                        page:parseInt(page),
                        next: next,
                        articles: articles
                    }

                    res.render("./admin/articles/page", { result: result, categories: categories });

                })
            }
        });
    });

});

module.exports = router;