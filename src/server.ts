import makeApp from "./app";
import Database from "./database/database";

const database = new Database(false);

makeApp(database).then((app) => {
	app.listen(app.locals.PORT, () => {
		console.log(`Listening on http://localhost:${app.locals.PORT} ...`);
	});
});

