const Category = require("../models/category");
const Critter = require("../models/critter");
const Supply = require("../models/supplies");
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display supply form on GET
exports.supply_create_get = asyncHandler(async (req, res, next) => {
    // Retrieve all categories with supply listed as type
    const supplyCategories = await Category.find({type: "supply"})
    .sort({name: 1})
    .exec();

    res.render("supply_form", {
        title: "Create a new supply",
        categories: supplyCategories,
    });
});

exports.supply_create_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.supply_delete_get = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.supply_delete_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.supply_update_get = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.supply_update_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

// Display supply details
exports.supply_detail = asyncHandler(async (req, res, next) => {
    const supply = await Supply.findById(req.params.id)
    .populate("category")
    .exec();

    // Supply not found, throw error
    if(supply === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    res.render("supply_detail", {
        title: "Supply Detail",
        supply: supply
    });
});

// Display list of all supplies
exports.supply_list = asyncHandler(async (req, res, next) => {
    const allSupplies = await Supply.find({})
    .sort({ name: 1 })
    .exec();
    res.render("supply_list", {
        title: "Supply List",
        supplyList: allSupplies,
    });
});