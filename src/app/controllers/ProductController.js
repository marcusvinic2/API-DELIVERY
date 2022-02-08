import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'

class ProductController {
	async store(request, response){
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			price: Yup.number().required(),
			categoryId: Yup.number().required(),
			Offer: Yup.boolean(),
		})

		try {
			await schema.validateSync(request.body, {abortEarly: false})
		} catch(err){
			return response.status(400).json({ error: err.errors })
		}

		const { admin: isAdmin } = await User.findByPk(request.userId)

		if(!isAdmin){
			return response.status(401).json()
		}

		const { filename: path } = request.file
		const { name, price, categoryId, Offer } = request.body

		const product = await Product.create({
			name,
			price,
			categoryId,
			path,
			Offer,
		})

		return response.json(product)
	}

	async index(request, response) {
			const products = await Product.findAll({
				include: [
					{
						model: Category,
						as: 'category',
						attributes: ['id','name'],
					}
				]
			})
			return response.json(products)
		}


	async update(request, response){
		const schema = Yup.object().shape({
			name: Yup.string(),
			price: Yup.number(),
			categoryId: Yup.number(),
			Offer: Yup.boolean(),
		})

		try {
			await schema.validateSync(request.body, {abortEarly: false})
		} catch(err){
			return response.status(400).json({ error: err.errors })
		}

		const { admin: isAdmin } = await User.findByPk(request.userId)

		if(!isAdmin){
			return response.status(401).json()
		}

		const { id } = request.params

		const product = await Product.findByPk(id)

		if(!product){
			return response.status(401).json({ error: "Produto id nao encontrado" })
		}

		let path 
		if(request.file){
			path = request.file.filename
		}

		const { name, price, categoryId, Offer } = request.body

		await Product.update({
			name,
			price,
			categoryId,
			path,
			Offer,
		},
			{ where: { id } }
		)

		return response.status(200).json()
		}
	}

export default new ProductController()