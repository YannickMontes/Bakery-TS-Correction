import { Express } from "express";
import { setup, teardown } from "./setupTests";
import { IUser } from "../database/Models/User";
import supertest from "supertest";

describe("USERS", () => {
	let app: Express;
	let user: IUser;
	let userToken: string;

	let product1 = { name: "Pain au choc", description: "Not a chocolatine", price: 0.15};
	let productNotValid = { nm: "Pain au choc", desc: "Not a chocolatine", price: 0.15};
	let wrongProdId = "653562b0766899761ef29310";

	let productId:string;

	beforeAll(async () => {
		let res = await setup();
		app = res.app;
		user = res.user;
		userToken = res.userToken;
	});

	afterAll(async () => {
		await teardown();
	});

	test("CREATE Product success", async () => {
		let res = await supertest(app)
			.post("/api/products/")
			.set("Authorization", userToken)
			.send(product1);

		expect(res.status).toBe(200);
		expect(res.body.product).toBeDefined();
		expect(res.body.error).toBeUndefined();

		productId = res.body.product._id;
	});

	test("CREATE Product unauth", async () => {
		let res = await supertest(app)
			.post("/api/products/")
			.send(product1);

		expect(res.status).toBe(401);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("CREATE Product validation failed", async () => {
		let res = await supertest(app)
			.post("/api/products/")
			.set("Authorization", userToken)
			.send(productNotValid);

		expect(res.status).toBe(400);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("GET All products success", async () => {
		let res = await supertest(app)
			.get("/api/products/")
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(200);
		expect(res.body.products).toBeDefined();
		expect(res.body.products.length).toBeDefined();
		expect(res.body.error).toBeUndefined();
	});

	test("GET Product success", async () => {
		let res = await supertest(app)
			.get("/api/products/" + productId)
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(200);
		expect(res.body.product).toBeDefined();
		expect(res.body.error).toBeUndefined();
	});

	test("GET Product not existing", async () => {
		let res = await supertest(app)
			.get("/api/products/"+wrongProdId)
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(404);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("MODIFY Product success", async () => {
		let res = await supertest(app)
			.put("/api/products/" + productId)
			.set("Authorization", userToken)
			.send({name: "LULZ"});

		expect(res.status).toBe(200);
		expect(res.body.product).toBeDefined();
		expect(res.body.product.name).toEqual("LULZ");
		expect(res.body.error).toBeUndefined();
	});

	test("MODIFY Product validation failed", async () => {
		let res = await supertest(app)
			.put("/api/products/" + productId)
			.set("Authorization", userToken)
			.send({ nm: "LULZ" });

		expect(res.status).toBe(400);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("MODIFY Product not existing", async () => {
		let res = await supertest(app)
			.put("/api/products/" + wrongProdId)
			.set("Authorization", userToken)
			.send({ name: "LULZ" });

		expect(res.status).toBe(404);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("BUY Product 10 times success", async () => {
		let limit = 10;
		for (let i = 1; i <= limit; i++) 
		{
			let res = await supertest(app)
				.post("/api/products/buy/" + productId)
				.set("Authorization", userToken)
				.send();

			expect(res.status).toBe(200);
			expect(res.body.product).toBeDefined();
			expect(res.body.product.stock).toBe(limit - i);
			expect(res.body.error).toBeUndefined();
		}
	});

	test("BUY Product no stock", async () => {
		let limit = 10;
		let res = await supertest(app)
			.post("/api/products/buy/" + productId)
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(200);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
		
	});

	test("BUY Product not existing", async () => {
		let limit = 10;
		let res = await supertest(app)
			.post("/api/products/buy/" + wrongProdId)
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(404);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});

	test("DELETE Product success", async () => {
		let res = await supertest(app)
			.delete("/api/products/" + productId)
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(200);
		expect(res.body.product).toBeDefined();
		expect(res.body.error).toBeUndefined();
	});

	test("DELETE Product not existing", async () => {
		let res = await supertest(app)
			.delete("/api/products/" + wrongProdId)
			.set("Authorization", userToken)
			.send();

		expect(res.status).toBe(404);
		expect(res.body.product).toBeUndefined();
		expect(res.body.error).toBeDefined();
	});
});
