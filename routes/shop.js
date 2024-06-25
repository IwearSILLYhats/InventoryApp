const express = require("express");
const router = express.Router();

// Require controller modules
const category_controller = require("../controllers/category_controller");
const critter_controller = require("../controllers/critter_controller");
const supply_controller = require("../controllers/supply_controller");

/// CATEGORY ROUTES ///

// GET for shop home page
router.get("/", category_controller.index);

// GET for creating a Category. NOTE this must come before routes that display Category (using ID)
router.get("/category/create", category_controller.category_create_get);

// POST for creating a Category
router.post("/category/create", category_controller.category_create_post);

// GET for deleting a Category
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST for deleting a Category
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET for updating a Category
router.get("/category/:id/update", category_controller.category_update_get);

// POST for updating a Category
router.post("/category/:id/update", category_controller.category_update_post);

// GET for one Category
router.get("/category/:id", category_controller.category_detail);

// GET for a list of all Category items
router.get("/categories", category_controller.category_list);

/// CRITTER ROUTES ///

// GET for creating a Critter. NOTE this must come before routes that display Critter (using ID)
router.get("/critter/create", critter_controller.critter_create_get);

// POST for creating a Critter
router.post("/critter/create", critter_controller.critter_create_post);

// GET for deleting a Critter
router.get("/critter/:id/delete", critter_controller.critter_delete_get);

// POST for deleting a Critter
router.post("/critter/:id/delete", critter_controller.critter_delete_post);

// GET for updating a Critter
router.get("/critter/:id/update", critter_controller.critter_update_get);

// POST for updating a Critter
router.post("/critter/:id/update", critter_controller.critter_update_post);

// GET for one Critter
router.get("/critter/:id", critter_controller.critter_detail);

// GET for a list of all Critter items
router.get("/critters", critter_controller.critter_list);

/// SUPPLY ROUTES ///

// GET for creating a Supply. NOTE this must come before routes that display Supply (using ID)
router.get("/supply/create", supply_controller.supply_create_get);

// POST for creating a Supply
router.post("/supply/create", supply_controller.supply_create_post);

// GET for deleting a Supply
router.get("/supply/:id/delete", supply_controller.supply_delete_get);

// POST for deleting a Supply
router.post("/supply/:id/delete", supply_controller.supply_delete_post);

// GET for updating a Supply
router.get("/supply/:id/update", supply_controller.supply_update_get);

// POST for updating a Supply
router.post("/supply/:id/update", supply_controller.supply_update_post);

// GET for one Supply
router.get("/supply/:id", supply_controller.supply_detail);

// GET for a list of all Supply items
router.get("/supplies", supply_controller.supply_list);
