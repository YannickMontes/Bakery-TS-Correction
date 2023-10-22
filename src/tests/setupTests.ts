import mongoose from "mongoose";
import Database from "../database/database";
import bcrypt from "bcrypt";
import makeApp from "../app";
import supertest from "supertest";
import { IUser } from "../database/Models/User";
import { Express } from "express";

interface SetupResult {
	app: Express;
	user: IUser;
	userToken: string;
}

async function setup() : Promise<SetupResult>
{
	let database = new Database(true);
	let app = await makeApp(database);

	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}

	let email = "test@test.fr";
	let password = "testpwd";
	let cryptedPassword = await bcrypt.hash(password, 5);
	await database.createUser(email, cryptedPassword);

	let res = await supertest(app).post("/api/auth/login").send({email, password});

	let userToken: string = res.body.token;
	let user: IUser = res.body.user;

	return {
		app,
		userToken, 
		user
	}
}

async function teardown() 
{
	await mongoose.disconnect();
}

export { setup, teardown };
