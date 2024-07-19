const Category = require("../models/category");
const Critter = require("../models/critter");
const Supply = require("../models/supplies");
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

// Handle critter creation on GET
exports.critter_create_get = asyncHandler(async (req, res, next) => {
    // Retrieve all supplies and all critter specific categories in paralell
    const [allSupplies, critterCategories] = await Promise.all([
        Supply.find({}).sort({ name: 1 }).exec(),
        Category.find({ type: "critter"}).sort({ name: 1}).exec(),
    ]);

    res.render("critter_form", {
        title: "Create a critter",
        supplies: allSupplies,
        categories: critterCategories
    })
});

exports.critter_create_post = [
    // Convert supplies to an array
    (req, res, next) => {
        if (!Array.isArray(req.body.supplies)) {
            req.body.supplies = typeof req.body.supplies === "undefined" ? [] : [req.body.supplies];
        }
        next()
    },
    // Convert categories to an array
    (req, res, next) => {
        if (!Array.isArray(req.body.categories)) {
            req.body.categories = typeof req.body.categories === "undefined" ? [] : [req.body.categories];
        }
        next()
    },

    // Validate and sanitize user entered data
    body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlphanumeric()
    .withMessage("Name must be alphanumeric characters only"),

    body("price")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Price must be a valid number"),
    
    body("stock")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Stock is required")
    .isNumeric()
    .withMessage("Stock must be a number"),

    body("info")
    .trim()
    .escape()
    .optional(),

    body("category")
    .escape(),

    body("related")
    .escape(),

    asyncHandler( async (req, res, next) => {
        // Extract validation errors from request
        const errors = validationResult(req);

        // Create a Critter object with sanitized data
        const critter = new Critter({
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            info: req.body.info,
            category: req.body.categories,
            related: req.body.supplies,
        });

        // Errors found, rerender form with previous data and errors
        if(!errors.isEmpty()){
            // Retrieve all supplies and all critter specific categories in paralell
            const [allSupplies, critterCategories] = await Promise.all([
                Supply.find({}).sort({ name: 1 }).exec(),
                Category.find({ type: "critter"}).sort({ name: 1}).exec(),
            ]);
            for(const supply of allSupplies){
                if(critter.related.includes(supply._id)) {
                    supply.checked = 'true';
                }
            }
            for(const category of critterCategories){
                if(critter.category.includes(category._id)) {
                    category.checked = 'true';
                }
            }

            res.render("critter_form", {
            title: "Create a critter",
            critter: critter,
            supplies: allSupplies,
            categories: critterCategories
            });
        }
        else{
            await critter.save();
            res.redirect(critter.url);
        }
    }),

];

exports.critter_delete_get = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.critter_delete_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.critter_update_get = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.critter_update_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

// Fetch critter detail on GET
exports.critter_detail = asyncHandler(async (req, res, next) => {
    const critter = await Critter.findById(req.params.id).populate("category related").exec();

    // Critter not found, redirect to critter list
    if(critter === null) {
        res.redirect("critter_list");
    }
    else{
        res.render("critter_detail", {
            title: "Critter Detail",
            critter: critter
        })
    }
});

// Fetch list of all critters on GET
exports.critter_list = asyncHandler(async (req, res, next) => {
    const allCritters = await Critter.find({})
    .sort({ name: 1 })
    .exec();

    res.render("critter_list", {
        title: "All Critters",
        critter_list: allCritters,
    });
});