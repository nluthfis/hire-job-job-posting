const router = require("express").Router();
const jobController = require("../controllers/jobs.controllers");

router.get("/jobs", jobController.get_jobs);

router.post("/jobs/company", jobController.create_company);

module.exports = router;
