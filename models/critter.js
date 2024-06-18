const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CritterSchema = new Schema({
    name: String,
    category: [{type: Schema.Types.ObjectId, ref: "Category"}],
    price: Number,
    stock: Number,
    info: String,
    related: [{type: Schema.Types.ObjectId, ref: "Supplies"}],
});

CritterSchema.virtual("url").get(function () {
    return `/${this._id}`;
});

module.exports = mongoose.Model("Critter", CritterSchema);