const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuppliesSchema = new Schema({
    type: String,
    price: Number,
    stock: Number,
    info: String
});

SuppliesSchema.virtual("url").get(function () {
    return `/${this._id}`;
})

module.exports = mongoose.model("Supplies", SuppliesSchema);