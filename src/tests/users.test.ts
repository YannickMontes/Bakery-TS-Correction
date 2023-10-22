import { Express } from "express";
import { setup, teardown } from "./setupTests";
import { IUser } from "../database/Models/User";
import supertest from "supertest";
describe("USERS", () => {
	let app:Express;
	let user:IUser;
	let userToken:string;

	beforeAll(async () => {
		let res = await setup();
		app = res.app; 
		user = res.user;
		userToken = res.userToken;
	});

	afterAll(async () => {
		await teardown();
	});

	test("REGISTER User success", async () => {
		let res = await supertest(app)
			.post("/api/auth/register")
			.send({ email: "testuser@test.fr", password: "password" });

		expect(res.status).toBe(200);
		expect(res.body.user).toBeDefined();
		expect(res.body.error).toBeUndefined();
	});

	test("REGISTER User already exists", async () => {
		let res = await supertest(app)
			.post("/api/auth/register")
			.send({ email: "testuser@test.fr", password: "password" });

		expect(res.status).toBe(400);
		expect(res.body.user).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("REGISTER User validation fail", async () => {
		let res = await supertest(app)
			.post("/api/auth/register")
			.send({ email: "not email", password: "password" });

		expect(res.status).toBe(400);
		expect(res.body.user).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("LOGIN User success", async () => {
		let res = await supertest(app)
			.post("/api/auth/login")
			.send({ email: "testuser@test.fr", password: "password" });

		expect(res.status).toBe(200);
		expect(res.body.user).toBeDefined();
		expect(res.body.token).toBeDefined();
		expect(res.body.error).toBeUndefined();
	});

	test("LOGIN validation failed", async () => {
		let res = await supertest(app)
			.post("/api/auth/login")
			.send({ email: "not email", password: "password" });

		expect(res.status).toBe(400);
		expect(res.body.user).toBeUndefined();
		expect(res.body.token).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("LOGIN wrong password", async () => {
		let res = await supertest(app)
			.post("/api/auth/login")
			.send({ email: "testuser@test.fr", password: "passwordwrong" });

		expect(res.status).toBe(400);
		expect(res.body.user).toBeUndefined();
		expect(res.body.token).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});
});