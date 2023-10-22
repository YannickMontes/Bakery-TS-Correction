import Joi from "joi";

const pwdMinSize: number = 5;
const pwdMaxSize: number = 15;

const postBodyFormat: Joi.ObjectSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	description: Joi.string().max(200),
	price: Joi.number().min(0).required(),
});

const putBodyFormat: Joi.ObjectSchema = Joi.object({
	name: Joi.string().min(3).max(30),
	description: Joi.string().min(0).max(200),
	price: Joi.number().min(0),
}).or("name", "description", "price");

const userBodyFormat: Joi.ObjectSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(pwdMinSize).max(pwdMaxSize).required(),
});

export default { postBodyFormat, putBodyFormat, userBodyFormat };
