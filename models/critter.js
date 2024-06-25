const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CritterSchema = new Schema({
    name: {type: String, required: true},
    category: [{type: Schema.Types.ObjectId, ref: "Category"}],
    price: {type: Number, min: 0},
    stock: {type: Number, min: 0, max: 99},
    info: String,
    related: [{type: Schema.Types.ObjectId, ref: "Supplies"}],
});

CritterSchema.virtual("url").get(function () {
    return `/shop/critter/${this._id}`;
});

module.exports = mongoose.Model("Critter", CritterSchema);