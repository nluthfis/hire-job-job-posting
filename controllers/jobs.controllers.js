const db = require("../config");
const jobModel = require("../models/jobs.models");
const cloudinary = require("cloudinary").v2;

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

async function create_company(req, res) {
  try {
    const { user_id, company_name, location, company_employee } = req.body;

    console.log(user_id);

    if (!(user_id && company_name && location && company_employee)) {
      res.status(400).json({
        status: false,
        message: "Bad input, please complete all of fields",
      });
      return;
    }

    if (!req.files || !req.files.company_logo) {
      res.status(400).json({
        status: false,
        message: "Company logo is missing",
      });
      return;
    }

    const { company_logo } = req.files;

    if (company_logo.size > 2000000) {
      res.status(400).send({
        status: false,
        message: "File to big, max size 2MB",
      });
    }

    let mimeType = company_logo.mimetype.split("/")[1];
    let allowFile = ["jpeg", "jpg", "png", "webp"];

    if (!allowFile?.find((item) => item === mimeType)) {
      res.status(400).send({
        status: false,
        message: "Only accept jpeg, jpg, png, webp",
      });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLODUNARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        company_logo.tempFilePath,
        {
          folder: "img/jobs",
          public_id: new Date().toISOString(),
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    const data = upload;

    const payload = {
      user_id,
      company_name,
      location,
      company_employee,
      company_logo: data?.secure_url,
    };

    const query = await jobModel.insertCompany(payload);
    res.json({
      status: true,
      message: "Success insert data",
      data: query,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}

module.exports = {
  get_jobs,
  create_company,
};
