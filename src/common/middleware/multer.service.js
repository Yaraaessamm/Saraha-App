import multer from "multer";
import fs from "node:fs";
export const multer_local_Middleware = ({
  customPath = "/general",
  allowedTypes = [],
} = {}) => {
  const filePath = `uploads${customPath}`;
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("These files are allowed"), false);
    }
  }
  const upload = multer({ storage, fileFilter });

  return upload;
};
export const multer_host_Middleware = ( allowedTypes = [] ) => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("These files are allowed"), false);
    }
    cb(null, true);
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};
