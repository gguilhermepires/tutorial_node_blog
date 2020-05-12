const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categorie',{
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
    }
});
Category.sync({force:false});

module.exports =  Category;