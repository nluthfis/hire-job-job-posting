const router = require("express").Router();
const jobController = require("../controllers/jobs.controllers");

router.get("/jobs", jobController.get_jobs);

module.exports = router;
