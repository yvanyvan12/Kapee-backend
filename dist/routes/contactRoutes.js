"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/contactRoutes.ts
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
// POST /api/contacts  → will hit your createContact controller
router.post('/contacts', contactController_1.createContact);
exports.default = router;
