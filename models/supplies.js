const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuppliesSchema = new Schema({
    name: {type: String, required: true, minLength: 1},
    category: [{type: Schema.Types.ObjectId, ref: "Categories"}],
    price: {type: Number, min: 0},
    stock: {type: Number, min: 0},
    info: String
});

SuppliesSchema.virtual("url").get(function () {
    return `/shop/supply/${this._id}`;
})

module.exports = mongoose.model("Supplies", SuppliesSchema);