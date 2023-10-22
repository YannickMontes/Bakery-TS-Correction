import mongoose, { Document, Model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import "mongoose-type-email";

interface IUser extends Document {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		//@ts-ignore
		type: mongoose.SchemaTypes.Email,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.plugin(uniqueValidator);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
export { IUser }
