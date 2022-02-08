import Sequelize from 'sequelize'
import User from '../app/models/User'
import Product from '../app/models/Product'
import Category from '../app/models/Category'
import configDatabase from '../config/database'
import mongoose from 'mongoose'

const models = [User, Product, Category]

class Database {
	constructor(){
		this.init()
		this.mongo()
	}
	init(){
		this.connection = new Sequelize(configDatabase)
		models.map(model => model.init(this.connection)).map( model => model.associate && model.associate(this.connection.models))
	}

	mongo(){
		this.mongoConection = mongoose.connect(
			'mongodb://153.92.214.229:27017/uppedidos',
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
			)
	}
}



 export default new Database()