"use strict";

const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, _, callback) {
    const path = `${__dirname}/app/${req.session.uuid}`;
    fs.mkdirSync(path, { recursive: true });
    const files = fs.readdirSync(path);
    const avatarFileName = files.find((file) => file.includes("avatar-image"));
    if (avatarFileName) {
      fs.unlinkSync(`${path}/${avatarFileName}`);
    }
    return callback(null, path);
  },
  filename: function (_, file, callback) {
    const fileExtension = file.originalname.split(".").pop();
    return callback(null, `avatar-image.${fileExtension}`);
  },
});

const uploadAvatarImage = multer({ storage });

function getAvatarPathByUUID(uuid) {
  try {
    const avatarDirPath = `${__dirname}/app/${uuid}`;
    const files = fs.readdirSync(avatarDirPath);
    const avatarFileName = files.find((file) => file.includes("avatar-image"));
    if (!avatarFileName) {
      return null;
    }
    return `${avatarDirPath}/${avatarFileName}`;
  } catch(error) {
    console.error("Error getting avatar path by UUID: ", error);
    return null;
  }
}

module.exports = {
  uploadAvatarImage,
  getAvatarPathByUUID,
};
