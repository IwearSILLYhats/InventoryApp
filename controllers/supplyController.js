const Category = require("../models/category");
const Critter = require("../models/critter");
const Supply = require("../models/supplies");
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");
const category = require("../models/category");

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

// Handle supply form on POST
exports.supply_create_post = [
    // Convert category to array
    (req, res, next) => {
        if (!Array.isArray(req.body.categories)) {
            req.body.categories = typeof req.body.categories === "undefined" ? [] : [req.body.categories];
        }
        next();
    },

    // Validate and sanitize
    body('name')
    .trim()
    .escape()
    .isLength({min: 1})
    .withMessage("Name is required")
    .isAlphanumeric()
    .withMessage("Name can contain alphanumeric characters only"),

    body('category')
    .escape(),

    body('price')
    .trim()
    .escape()
    .isNumeric()
    .withMessage("Numbers only")
    .isInt({gte: 0})
    .withMessage("Price cannot be negative"),

    body('stock')
    .trim()
    .escape()
    .isNumeric()
    .withMessage("Numbers only")
    .isInt({gte: 0})
    .withMessage("Stock cannot be negative"),

    body('info')
    .trim()
    .escape(),

    asyncHandler(async (req, res, next) => {
    // Check for errors from validation
    const errors = validationResult(req);

    const supply = new Supply({
        name: req.body.name,
        category: req.body.categories,
        price: req.body.price,
        stock: req.body.price,
        info: req.body.info
    })
    // Errors found, rerender form with previous data and errors
    if(!errors.isEmpty()){
        const supplyCategories = await Category.find({type: "supply"})
        .sort({name: 1})
        .exec();

        for(const category of supplyCategories){
            if(supply.category.includes(category._id)) {
                category.checked = 'true';
            }
        }

        res.render("supply_form", {
            title: "Create new supply",
            supply: supply,
            categories: supplyCategories,
            errors: errors.array(),
        });
    }
    // Data is valid, save to server then redirect to new supply detail page
    else{
        await supply.save();
        res.redirect(supply.url);
    }
})
];

// Handle supply delete form on GET
exports.supply_delete_get = asyncHandler(async (req, res, next) => {
    // Retrieve supply and all related critters
    const [supply, relatedCritters] = await Promise.all([
        Supply.findById(req.params.id),
        Critter.find({related: req.params.id}).sort("name").exec(),
    ]);
    // Supply not found, redirect to list of supplies
    if(supply === null) {
        res.redirect("/shop/supplies");
    }
    else{
        res.render("supply_delete", {
            title: "Delete a category",
            supply: supply,
            critters: relatedCritters,
        });
    };
});

// Handle supply delete on POST
exports.supply_delete_post = asyncHandler(async (req, res, next) => {
    // Retrieve supply and all related critters
    const [supply, relatedCritters] = await Promise.all([
        Supply.findById(req.params.id),
        Critter.find({related: req.params.id}).sort("name").exec(),
    ]);
    // Supply not found, redirect to list of supplies
    if(supply === null) {
        res.redirect("/shop/supplies");
    }
    else if(relatedCritters.length > 0) {
        // Supply still has related critters
        res.render("supply_delete", {
            title: "Delete a category",
            supply: supply,
            critters: relatedCritters,
        })
    }
    else{
        await Supply.findByIdAndDelete(req.body.supplyId);
        res.redirect("/shop/supplies");
    };
});

// Handle supply update on GET
exports.supply_update_get = asyncHandler(async (req, res, next) => {
    // retrieve supply to be updated and all supply categories in paralell
    const [supply, supplyCategories] = await Promise.all([
        Supply.findById(req.params.id),
        Category.find({type: "supply"}).sort({name: 1}).exec()
    ]);
    for(const category of supplyCategories){
        if(supply.category.includes(category._id)) {
            category.checked = 'true';
        }
    }
    // If requested supply not found, redirect to supply list
    if(supply === null){
        res.redirect("/shop/supplies");
    }
    else{
        res.render("supply_form", {
            title: "Update a supply",
            supply: supply,
            categories: supplyCategories,
        });
    };
});

// Handle supply update on POST
exports.supply_update_post = [
    // Convert category to array
    (req, res, next) => {
        if (!Array.isArray(req.body.categories)) {
            req.body.categories = typeof req.body.categories === "undefined" ? [] : [req.body.categories];
        }
        next();
    },

    // Validate and sanitize
    body('name')
    .trim()
    .escape()
    .isLength({min: 1})
    .withMessage("Name is required")
    .isAlphanumeric()
    .withMessage("Name can contain alphanumeric characters only"),

    body('category')
    .escape(),

    body('price')
    .trim()
    .escape()
    .isNumeric()
    .withMessage("Numbers only")
    .isInt({gte: 0})
    .withMessage("Price cannot be negative"),

    body('stock')
    .trim()
    .escape()
    .isNumeric()
    .withMessage("Numbers only")
    .isInt({gte: 0})
    .withMessage("Stock cannot be negative"),

    body('info')
    .trim()
    .escape(),

    asyncHandler(async (req, res, next) => {
    // Check for errors from validation
    const errors = validationResult(req);

    const supply = new Supply({
        name: req.body.name,
        category: typeof req.body.categories === "undefined" ? [] : req.body.categories,
        price: req.body.price,
        stock: req.body.price,
        info: req.body.info,
        _id: req.params.id
    })
    // Errors found, rerender form with previous data and errors
    if(!errors.isEmpty()){
        const supplyCategories = await Category.find({type: "supply"})
        .sort({name: 1})
        .exec();

        for(const category of supplyCategories){
            if(supply.category.includes(category._id)) {
                category.checked = 'true';
            }
        }

        res.render("supply_form", {
            title: "Create new supply",
            supply: supply,
            categories: supplyCategories,
            errors: errors.array(),
        });
    }
    // Data is valid, save to server then redirect to new supply detail page
    else{
        const updatedSupply = await Supply.findByIdAndUpdate(req.params.id, supply, {});
        res.redirect(updatedSupply.url);
    }
})
];

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