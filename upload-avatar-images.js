"use strict";

const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, _, callback) {
    const path = `./app/${req.session.uuid}/`;
    fs.mkdirSync(path, { recursive: true });
    return callback(null, path);
  },
  filename: function (req, file, callback) {
    const fileExtension = file.originalname.split(".").pop();
    return callback(null, `avatar-image.${fileExtension}`);
  },
});

const uploadAvatarImage = multer({ storage });

function getAvatarPathByUUID(uuid) {
  const avatarDirPath = `${__dirname}/app/${uuid}`;
  const files = fs.readdirSync(avatarDirPath);
  const imageFileName = files.find((file) => file.includes("avatar-image"));
  return `${avatarDirPath}/${imageFileName}`;
}

module.exports = {
  uploadAvatarImage,
  getAvatarPathByUUID,
};
