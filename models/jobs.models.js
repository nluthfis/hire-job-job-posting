const db = require("../config");

const getAllJob = async (sort) => {
  try {
    const query = await db`SELECT * FROM jobs ORDER BY "created_at" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};

const getJobByTitle = async (job_title, sort) => {
  try {
    const query = await db`SELECT *, count(*) OVER() as full_count 
      FROM jobs 
      WHERE job_title LIKE ${job_title} 
      ORDER BY "created_at" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};

const getJobByType = async (job_type, sort) => {
  try {
    const query = await db`SELECT *, count(*) OVER() as full_count 
      FROM jobs 
      WHERE job_type LIKE ${job_type} 
      ORDER BY "created_at" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};

const getJobByTitleAndType = async (job_title, job_type, sort) => {
  try {
    const query = await db`
      SELECT *, count(*) OVER() as full_count
      FROM jobs
      WHERE job_title LIKE ${job_title} AND job_type LIKE ${job_type}
      ORDER BY "created_at" ${sort}`;
    return query;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getJobByTitle,
  getJobByType,
  getJobByTitleAndType,
  getAllJob,
};
