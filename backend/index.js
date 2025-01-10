const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const config = require("../config");

const app = express();
const port = 8176;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Add helper function to clear uploads directory
const clearUploads = () => {
  const directory = "./uploads";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

app.post("/data", upload.array("files"), async (req, res) => {
  try {
    const caption = req.body.caption;
    const files = req.files;

    const savedPaths = files.map((file) => path.resolve(__dirname, file.path));

    const requestData = {
      input_value: caption,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        [config.CHAT_INPUT_COMPONENT]: {
          path: savedPaths,
        },
      },
    };
    console.log(requestData);
    const response = await axios.post(
      `${config.API_URL}/${config.FLOW_ID}`,
      requestData,
      { headers: { "Content-Type": "application/json" } }
    );

    res.send(response.data);

    // Clear uploads folder after sending response
    clearUploads();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing request");
    clearUploads(); // Also clear on error
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
