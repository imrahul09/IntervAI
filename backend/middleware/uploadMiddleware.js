import multer from "multer";

const storage = multer.memoryStorage(); // the pdf stays temporararily in memory insteaad of creating
//random files on your server , we'll extract the text and then
// save the useful information to the mongodb

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // maximum file size 5mb
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      // only pdf file allowed
      cb(null, true);
    } else {
      cb(new Error("only pdf file are allowed"));
    }
  },
});

export default upload;
