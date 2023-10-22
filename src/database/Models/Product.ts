import mongoose, { Document, Model } from "mongoose";

interface IProduct extends Document {
	name: string;
	description: string;
	price: number;
	stock: number;
}

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	stock:{
		type: Number,
		default: 10
	}
});

const Product: Model<IProduct> = mongoose.model<IProduct>(
	"Product",
	ProductSchema
);

export default Product;
export { IProduct };
