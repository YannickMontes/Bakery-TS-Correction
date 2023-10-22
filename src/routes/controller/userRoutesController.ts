import { Request, Response } from "express";
import joiValidator from "../../middlewares/joiValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

async function login(req: Request, res: Response)
{
	const isBodyCorrect = joiValidator.userBodyFormat.validate(req.body);

	if (isBodyCorrect.error) {
		return res
			.status(400)
			.json({ error: isBodyCorrect.error.details[0].message });
	}

	try {
		const { user, error } = await req.app.locals.database.getUser(
			req.body.email
		);

		if (error) {
			return res.status(500).json({ error });
		}

		if (!user || !user.email) {
			return res.status(404).json({ error: "User not found." });
		}

		try {
			const pwdCorrect = await bcrypt.compare(
				req.body.password,
				user.password
			);

			if (!pwdCorrect) {
				return res
					.status(400)
					.json({ error: "Incorrect password." });
			}

			const token = jwt.sign(
				{ userId: user._id },
				process.env.SECRET_KEY as string,
				{
					expiresIn: process.env.TOKEN_EXP,
				}
			);
			res.status(200).json({ user, token });
		} catch (error) {
			return res.status(500).json({ error });
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
}

async function register(req: Request, res: Response)
{
	const isBodyCorrect = joiValidator.userBodyFormat.validate(req.body);

	if (isBodyCorrect.error) {
		return res
			.status(400)
			.json({ error: isBodyCorrect.error.details[0].message });
	}

	try {
		const { user, error } = await req.app.locals.database.getUser(
			req.body.email
		);

		if (user && user.email) {
			return res
				.status(400)
				.json({
					error: "Email is already existing in the database.",
				});
		}

		if (error) {
			return res.status(500).json({ error });
		}

		try {
			const hash = await bcrypt.hash(req.body.password, 5);
			const { user, error } =
				await req.app.locals.database.createUser(
					req.body.email,
					hash
				);

			if (error) {
				return res.status(500).json({ error });
			}

			return res.status(200).json({ user });
		} catch (error) {
			return res.status(500).json({ error });
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
}


export default {
	login,
	register
}