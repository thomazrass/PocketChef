const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const runCompletion = require("./chat");
const fs = require("fs");

const app = express();
const port = 2900;
app.use(fileUpload());
app.use(cors());

app.use("/public", express.static("public"));

app.post("/process", async (req, res) => {
  //onsole.log(req);
  console.log("Request received");
  // //if (!req.files.image) {
  //   console.log("unpacking failed");
  //   return res.status(400).send("No files were uploaded.");
  // }
  //const uploadedFile = req.files.image;
  // uploadedFile.mv("./public/temp.jpeg", async function (err) {
  //   if (err) return res.status(500).send(err);
  //   const imageUrl = `http://localhost:2900/public/temp.jpeg`;
  //   //var chat = await runCompletion(imageUrl);
  //   //res.send(chat);
  // });

  // fs.readFile(
  //   "./public/temp.jpeg",
  //   { encoding: "base64" },
  //   async (err, base64Image) => {
  //     if (err) {
  //       console.error("Error reading the file:", err);
  //       return res.status(500).send(err);
  //     }

  // b644 =
  //   `data:${uploadedFile.mimetype};base64,` +
  //   base64Image.toString("base64");
  try {
    //console.log(b644);

    var chat = await runCompletion(req.body.image);
    //console.log(chat);
    console.log(chat.choices[0].message.content);
    res.send(chat.choices[0].message.content);
  } catch (error) {
    console.error("Error in runCompletion:", error);
    res.status(500).send("Error processing the image");
  }
});
console.log("success");
//console.log(req.files.image);
//var chat = await runCompletion(uploadedFile);
//res.send(chat);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
