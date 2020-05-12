const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require('slugify');
const adminAth = require("../middlewares/adminAuth");


//npm install slugify
router.get("/admin/categories/new",adminAth, (req, res) => {
    res.render("./admin/categories/new");
});

router.post("/admin/categories/save",adminAth, (req, res) => {
    var title = req.body.title;
    if (title != undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(_ => {
            res.redirect('/admin/categories')
        }).catch(e => {
            console.log(e);
            res.redirect('/admin/categories/new')
        });

    } else {
        res.redirect('/admin/categories/new')
    }
});

router.get("/admin/categories",adminAth, (req, res) => {

    Category.findAll().then(categories => {
        res.render("./admin/categories/index", {
            categories: categories
        });
    });
});
router.post("/admin/categories/delete",adminAth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        //verifica se é um número
        if (!isNaN(id)) {

            Category.destroy({ where: { id: id } }).then(e => {
                res.redirect('/admin/categories')
            }).catch(e => {
                res.redirect('/admin/categories')
            })
        } else {
            res.redirect('/admin/categories')
        }
    } else {
        res.redirect('/admin/categories')
    }
});

router.get("/admin/categories/edit/:id",adminAth, (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories');
    }

    Category.findByPk(id).then(category => {

        if (category != undefined) {
            res.render("./admin/categories/edit", {
                category: category
            });
        } else {
            res.redirect('/admin/categories')
        }

    }).catch(e => {
        res.redirect('/admin/categories')
    });
});

router.post("/admin/categories/update",adminAth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    if (id != undefined) {
        //verifica se é um número
        if (!isNaN(id)) {

            Category.update({title:title,slug:slugify(title)},{ where: { id: id } }).then(e => {
                res.redirect('/admin/categories')
            }).catch(e => {
                res.redirect('/admin/categories')
            })
        } else {
            res.redirect('/admin/categories')
        }
    } else {
        res.redirect('/admin/categories')
    }
});
module.exports = router;