const Category = require("../models/category");
const Critter = require("../models/critter");
const Supply = require("../models/supplies");
const {body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

// Index page showing count for different types of critters and supplies in stock (non-zero in inventory)
exports.index = asyncHandler(async (req, res, next) => {
    // Get counts for critters and supplies in parallel
    const [numCritters, numSupplies] = await Promise.all([
        Critter.countDocuments({}).exec(),
        Supply.countDocuments({}).exec(),
    ]);
    res.render("index", {
        title: "Exotic Pets Home",
        critter_count: numCritters,
        supply_count: numSupplies,
    });
});

// Display blank form to create new category
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: "Create new category",
    });
});

exports.category_create_post = [
    // Validation and sanitization
    body('name')
        .trim()
        .escape()
        .isLength({min:1})
        .withMessage('Name must be specified')
        .isAlphanumeric()
        .withMessage('Name has non-alphanumeric characters'),
    
    body("type")
        .trim()
        .escape()
        .isIn(['critter', 'supply'])
        .withMessage('Please choose a category type.'),

    body('info')
        .trim()
        .escape()
        .optional({values: null}),

    // Process request after sanitization
    asyncHandler(async (req, res, next) => {
        // Extract errors
        const errors = validationResult(req);

        // Create Category object with escaped and trimmed data
        const category = new Category({
            name: req.body.name,
            type: req.body.type,
            info: req.body.info
        })
        if(!errors.isEmpty()) {
            // Found errors, rerender with sanitized values/error messages
            res.render("category_form", {
                title: "Create a new category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            // Data is valid

            // Save category
            await category.save();
            // Redirect to new category record
            res.redirect(category.url);
        }

    }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    // NOT IMPLEMENTED
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    // IN PROGRESS
    const category = await Category.findById(req.params.id).exec();

    if(category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: category.name,
        category: category,
    })
});

exports.category_list = asyncHandler(async (req, res, next) => {
    const categoryList = await Category.find({}, "name type")
    .sort({name: 1})
    .exec();

    res.render("category_list", {
        title: "Category List",
        category_list: categoryList,
    })
});