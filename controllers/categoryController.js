const Category = require("../models/category");
const Critter = require("../models/critter");
const Supply = require("../models/supplies");
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get counts for critters and supplies in parallel
    const [numCritters, numSupplies] = await Promise.all([
        Critter.countDocuments({stock: {gt: 0}}).exec(),
        Supply.countDocuments({stock: {gt: 0}}).exec(),
    ]);
    res.render("index", {
        title: "Exotic Pets Home",
        critter_count: test,
        supply_count: numSupplies,
    });
});