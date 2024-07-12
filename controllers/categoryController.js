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

// Display category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    // Retrieves all related supplies and categories in parallel
    const [category, allCritters, allSupplies] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Critter.find({category: req.params.id}, "name").exec(),
        Supply.find({category: req.params.id}, "name").exec()
    ]);

    // If category not found, redirect to category list
    if (category === null){
        res.redirect("/shop/categories");
    }

    res.render("category_delete", {
        category: category,
        critterList: allCritters,
        supplyList: allSupplies,
        title: "Delete a category",
    })
});

// Handle category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    // Retrieves all related supplies and categories in parallel
    const [category, allCritters, allSupplies] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Critter.find({category: req.params.id}, "name").exec(),
        Supply.find({category: req.params.id}, "name").exec()
    ]);

    if(allCritters.length > 0 || allSupplies.length > 0){
        // Category still has associated critter or supply
        res.render("category_delete", {
            category: category,
            critterList: allCritters,
            supplyList: allSupplies,
            title: "Delete a category",
        });
        return;
    }
    else{
        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect("/shop/categories");
    }
});

// Display category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    // Category not found
    if(category === null) {
        res.redirect("/shop/categories");
    }
    else{
        res.render("category_form", {
            title: "Update a category",
            category: category,
        });
    };
});

// Handle category update on POST
exports.category_update_post = [
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
            info: req.body.info,
            _id: req.params.id // This is required, or a new ID will be assigned
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
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            // Redirect to new category record
            res.redirect(updatedCategory.url);
        }

    }),
];

// Displays detailed info for one category
exports.category_detail = asyncHandler(async (req, res, next) => {
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

// Display full category list
exports.category_list = asyncHandler(async (req, res, next) => {
    const categoryList = await Category.find({}, "name type")
    .sort({name: 1})
    .exec();

    res.render("category_list", {
        title: "Category List",
        category_list: categoryList,
    })
});