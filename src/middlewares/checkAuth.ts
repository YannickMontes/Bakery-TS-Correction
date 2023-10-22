import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';

interface IToken
{
	userId: string;
}

async function checkAuth(req: Request, res: Response, next: NextFunction)
{
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ error: "Need a token!" });
	}

	try {
		const decodedToken: IToken = jwt.verify(token, process.env.SECRET_KEY as string) as IToken;
		const userId = decodedToken.userId;
		res.locals.userId = userId;
	} catch (error) {
		return res.status(401).json({ error: "Expired token!" });
	}

	next();
}

export default checkAuth;