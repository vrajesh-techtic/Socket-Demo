const fs = require("fs");
const path = require("path");

const savePic = async (file, username) => {
  console.log("file", file);
  try {
    if (!file) {
      return {
        status: true,
        url: `${process.env.BACKEND_URL}/uploads/profile-images/defaultProfilePic.png`,
        fileName: "defaultProfilePic.png",
      };
    }
    const uploadPath = path.join(__dirname, "..", "uploads", "profile-images");

    const fileName = `${Date.now()}_${username}.png`;

    const fileLocation = path.join(uploadPath, fileName);

    fs.writeFileSync(fileLocation, file.buffer);

    return {
      status: true,
      url: `${process.env.BACKEND_URL}/uploads/profile-images/${fileName}`,
      fileName,
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const deletePic = async (fileName) => {
  const uploadPath = path.join(__dirname, "..", "uploads", "profile-images");

  const fileLocation = path.join(uploadPath, fileName);

  try {
    fs.unlinkSync(fileLocation);
    return { status: true, message: "Old Profile Pic removed!" };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = { savePic, deletePic };
