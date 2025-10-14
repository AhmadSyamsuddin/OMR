const { signToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');
const {User} = require('../models');
class UserController {
    static async register(req, res, next) {
        try {
            const { fullName, email, password } = req.body;
            const user = await User.create({ fullName, email, password });
            res.status(201).json({ id: user.id, email: user.email });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if(!email){
                throw { name: 'Bad Request', message: 'Email is required' };
            }

            if(!password){
                throw { name: 'Bad Request', message: 'Password is required' };
            }
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw { name: 'Unauthorized', message: 'Email or password is invalid' };
            }
            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw { name: 'Unauthorized', message: 'Email or password is invalid' };
            }

            const access_token = signToken({ id: user.id, email: user.email });
            res.status(200).json({ access_token });
        } catch (error) {
            next(error);
        }
    }
    static async updateMembership(req, res, next) {
        try {
            const { id } = req.user;

            const user = await User.findByPk(id);
            if (!user) {
                throw { name: 'Not Found', message: 'User not found' };
            }

            await user.update({ isMembership: true });

            res.status(200).json({ message: 'Membership status updated successfully', user: { id: user.id, email: user.email, isMembership: user.isMembership } });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
