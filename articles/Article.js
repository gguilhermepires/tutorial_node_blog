const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = require('../categories/Category');

const Article = connection.define('article',{
   id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },
    slug:{
        type:Sequelize.STRING,
        allowNull:false 
    },
    body:{
        type:Sequelize.TEXT,
        allowNull:false 
    }
});
// uma categoria tem varios artigos
Category.hasMany(Article);
// um para um
Article.belongsTo(Category);

Article.sync({force:false});

module.exports =  Article;