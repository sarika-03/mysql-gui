const express = require("express");
const dbController = require("../controllers/dbController");
const dbRouter = express.Router();

dbRouter.get("/databases", dbController.getDatabases);
dbRouter.get("/database/:dbName/tables", dbController.getTables);
dbRouter.post("/database/:dbName/execute-query", dbController.executeQuery);

module.exports = dbRouter;
