import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionController {
	async store(request, response){
		const schema = Yup.object().shape({
			email: Yup.string().email().required(),
			password: Yup.string().required(),
		})

		if(!(await schema.isValid(request.body))) {
			return response.status(400).json({ error: 'Email ou senha incorretos'})
		}

		const { email, password } = request.body

		const user = await User.findOne({
			where: { email },
		})

		if(!user){
			return response.status(400).json({ error: 'Email ou senha incorretos'})
		}

		if(!(await user.checkPassword(password))){
			return response.status(401).json({ error: 'Email ou senha incorretos'})
		}

		return response.json({ 
			id: user.id, 
			email, 
			name: user.name, 
			admin: user.admin, 
			token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}) 
		})
	}
}

export default new SessionController()