import { Request, Response } from "express";
import joiValidator from "../../middlewares/joiValidator";

async function getAllProducts(req: Request, res: Response)
{
	let {products, error } = await req.app.locals.database.getAllProducts();
	if(error)
		return res.status(500).json({error});
	else
		return res.status(200).json({products});
}

async function getProductById(req: Request, res: Response)
{
	let { product, error } = await req.app.locals.database.getProduct(req.params.id);
	if(error)
		return res.status(500).json({error});
	else if(product == null)
		return res.status(404).json({error: "Product not found."});
	else
		return res.status(200).json({ product });
}

async function createProduct(req: Request, res: Response)
{
	const isBodyCorrect = joiValidator.postBodyFormat.validate(req.body);

	if (isBodyCorrect.error) {
		return res
			.status(400)
			.json({ error: isBodyCorrect.error.details[0].message });
	}

	try {
		const { product, error } = await req.app.locals.database
			.createProduct(req.body.name, req.body.description, req.body.price);

		if (error) {
			return res.status(500).json({ error });
		} else {
			return res.status(200).json({ product });
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
}

async function modifyProduct(req: Request, res: Response)
{
	const isBodyCorrect = joiValidator.putBodyFormat.validate(req.body);

	if (isBodyCorrect.error) {
		return res
			.status(400)
			.json({ error: isBodyCorrect.error.details[0].message });
	}

	try {
		const { product, error } =
			await req.app.locals.database.modifyProduct(
				req.params.id,
				req.body
			);

		if (error) {
			return res.status(500).json({ error });
		} else if (product == null) {
			return res.status(404).json({ error: "Product not found." });
		} else {
			return res.status(200).json({ product });
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
}

async function deleteProduct(req: Request, res: Response)
{
	let { product, error } = await req.app.locals.database.deleteProduct(
		req.params.id
	);
	if (error) 
		return res.status(500).json({ error });
	else if(product == null)
		return res.status(404).json({error: "Product not found."});
	else 
		return res.status(200).json({ product });
}

async function buyProduct(req: Request, res: Response)
{
	let { product, error, hasStock } =  await req.app.locals.database.productHasStock(req.params.id);
	if (error) 
		return res.status(500).json({ error });
	else if (product == null)
		return res.status(404).json({ error: "Product not found." });
	else
	{
		if(hasStock)
		{
			let buyProdRes = await req.app.locals.database.buyProduct(req.params.id);
			if(buyProdRes.error)
				return res.status(500).json({ error: buyProdRes.error });
			else if(buyProdRes.product == null)
				return res.status(404).json({ error: "Product not found." });
			else
				return res.status(200).send({ product: buyProdRes.product });
		}
		else
		{
			return res.status(200).json({ error: "No stock left for this product." });
		}
	}
}

export default {
	getAllProducts,
	getProductById,
	createProduct,
	modifyProduct, 
	deleteProduct,
	buyProduct
}