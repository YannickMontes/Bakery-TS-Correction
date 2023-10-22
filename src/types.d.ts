import Database from "./database/database";

declare global {
	namespace Express {
		interface Locals {
			database: Database;
			userId: string;
		}
	}
}
