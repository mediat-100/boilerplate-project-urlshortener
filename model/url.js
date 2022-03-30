const mongoose = require("mongoose");
const validator = require("validator");

const urlSchema = mongoose.Schema({
	original_url: {
		type: String,
	},

	short_url: {
		type: Number,
		unique: true
	},
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
