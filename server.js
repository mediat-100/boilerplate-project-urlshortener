const express = require("express");
const mongoose = require("mongoose");
const validUrl = require("valid-url");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

require("dotenv").config({ path: "./sample.env" });

const Url = require("./model/url");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/views/index.html");
});

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("DB connected successfully"))
	.catch((err) => console.log("error", err));

// Your first API endpoint
app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", urlencodedParser, async function (req, res) {
	try {
		// check if url is a valid webUri
		if (!validUrl.isWebUri(req.body.url)) {
			return res.json({
				error: "invalid url",
			});
		}

		// if url is valid
		const url = await Url.create({
			original_url: req.body.url,
			short_url: Math.floor(Math.random() * 100),
		});

		return res.json({
			original_url: url.original_url,
			short_url: url.short_url,
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

app.get("/api/shorturl/:short_url", async function (req, res) {
	try {
		const url = await Url.findOne({
			short_url: parseInt(req.params.short_url),
		});

		return res.redirect(url.original_url);
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
});

app.listen(port, function () {
	console.log(`Listening on port ${port}`);
});
