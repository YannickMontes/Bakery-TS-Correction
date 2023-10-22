import mongoose from "mongoose";
import Product, { IProduct } from './Models/Product'; // Import the Product model and IProduct interface
import User, { IUser } from "./Models/User";

interface ProductResult
{
	product?: IProduct | null
	error?: any
}

interface StockProductResult extends ProductResult
{
	hasStock: boolean;
}

interface UserResult
{
	user?: IUser | null;
	error?: any;
}

interface ProductsResult 
{
	products?: IProduct[];
	error?: any;
}

class Database {
	constructor(private isFromTest: boolean) {}

	async connect() {
		try {
			let dbAddress = (
				this.isFromTest
					? process.env.DB_ADDRESS_TEST
					: process.env.DB_ADDRESS
			) as string;
			await mongoose.connect(dbAddress);
			console.log(`DB Connected ! (${dbAddress})`);
		} catch (error) {
			console.log("Error while connecting to DB !");
			console.log(error);
		}
	}

	async getAllProducts() : Promise<ProductsResult>
	{
		try {
			let products = await Product.find();
			return { products };
		} catch (error) {
			return { error };
		}
	}

	async getProduct(id: string): Promise<ProductResult> 
	{
		try {
			const product: IProduct | null = await Product.findById(id);
			return { product };
		} catch (error) {
			return { error };
		}
	}

	async createProduct(
		name: string,
		description: string,
		price: number
	): Promise<ProductResult> {
		try {
			const product = new Product({
				name,
				description,
				price,
			});
			await product.save();
			return { product };
		} catch (error) {
			return { error };
		}
	}

	async deleteProduct(id: string): Promise<ProductResult> {
		try {
			const product: IProduct | null = await Product.findByIdAndDelete(
				id
			);
			return { product };
		} catch (error) {
			return { error };
		}
	}

	async modifyProduct(id: string, updateObj: Partial<Omit<IProduct, "stock">>): Promise<ProductResult> 
	{
		try {
			const product: IProduct | null = await Product.findByIdAndUpdate(
				id,
				updateObj,
				{ new: true }
			);
			return { product };
		} 
		catch (error) 
		{
			return { error };
		}
	}

	async productHasStock(id: string) : Promise<StockProductResult>
	{
		try {
			const product: IProduct | null = await Product.findById(id);
			return { product, hasStock: (product != null ? product.stock > 0 : false) };
		} catch (error) {
			return { error, hasStock: false };
		}
	}

	async buyProduct(id: string) : Promise<ProductResult>
	{
		try {
			let product = await Product.findByIdAndUpdate(
				id,
				{ $inc: { stock: -1 } },
				{ new: true }
			);
			return { product };
		} catch (error) {
			return { error };
		}
	}

	async getUser(email: string) : Promise<UserResult>
	{
		try
		{
			let user = await User.findOne({email});
			return { user };
		}
		catch(error)
		{
			return { error };
		}
	}

	async createUser(email: string, hashPwd:string): Promise<UserResult>
	{
		try
		{
			let user = new User({
				email,
				password: hashPwd,
			});
			await user.save();
			return { user };
		}
		catch(error)
		{
			return { error };
		}
	}
}

export default Database;