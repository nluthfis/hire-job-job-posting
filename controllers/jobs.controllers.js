const db = require("../config");
const jobModel = require("../models/jobs.models");

async function get_jobs(req, res) {
  try {
    let query;
    let job_title = `%${req?.body?.job_title}%`;
    let job_type = `%${req?.body?.job_type}%`;
    let page =
      req?.body?.page &&
      !isNaN(req?.body?.page) &&
      parseInt(req?.body?.page) >= 1;
    let sort = db`DESC`;

    if (req?.body?.sortType?.toLowerCase() === "asc") {
      if (page) {
        sort = db`ASC LIMIT 5 OFFSET ${5 * (parseInt(req?.body?.page) - 1)}`;
      } else {
        sort = db`ASC`;
      }
    }

    if (page && !req?.body?.sortType) {
      sort = db`DESC LIMIT 5 OFFSET ${5 * (parseInt(req?.body?.page) - 1)}`;
    }

    if (req?.body?.job_title) {
      query = await jobModel.getJobByTitle(job_title, sort);
    } else if (req?.body?.job_type) {
      query = await jobModel.getJobByType(job_type, sort);
    } else if (req?.body?.job_type && req?.body?.job_type) {
      query = await jobModel.getJobByTitleAndType(job_title, job_type, sort);
    } else {
      query = await jobModel.getAllJob(sort);
    }

    res.status(200).json({
      status: "success",
      total: query?.length ?? 0,
      pages: page
        ? {
            current: parseInt(req?.body?.page),
            total: query?.[0]?.full_count
              ? Math.ceil(parseInt(query?.[0]?.full_count) / 5)
              : 0,
          }
        : {
            current: 1,
            total: query?.[0]?.full_count
              ? Math.ceil(parseInt(query?.[0]?.full_count) / 5)
              : 0,
          },
      data: query,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

module.exports = {
  get_jobs,
};
