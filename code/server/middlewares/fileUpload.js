const multer = require('multer');
const uuid = require('uuid');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');

const MIME_TYPE_MAP = {
  'application/zip': 'zip',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
};

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, `./uploads/${ext}file`);
    },
    filename: (req, file, cb) => {
      // console.log('at file upload:', file);
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v4() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid
      ? null
      : new CustomError(
          codes.MIME_TYPE_INVALID,
          'Your file extension is invalid',
        );
    cb(error, isValid);
  },
});

module.exports = fileUpload;
