const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const xss = require("xss");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jobRoutes = require("./routes/jobs.route");

app.use(helmet());
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(jobRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

// app.post("/example", (req, res) => {
//   const sanitizedInput = xss(req.body.input);
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
