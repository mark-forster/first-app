const multer = require('multer');
const uuid4 = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname === 'image'){
      cb(null, 'uploads/images/')
    }else if(file.fieldname === 'shortVideo'){
      cb(null, 'uploads/video/')
     }else{
      cb(null, 'uploads/pdf/')
     }
  },
  filename: (req, file, cb) => {
    cb(null, uuid4.v4() + '-' + file.originalname)
  },
})
const fileFilter = (req, file, cb) => {
  const fileSize = parseInt(req.headers["content-length"])
  if (file.fieldname == 'image') {
    if ((file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') && fileSize <= 1282810) {
      cb(null, true);
    }
    else {
      cb(new Error('Invalid image'));
    }
  }
  else if(file.fieldname == 'shortVideo') {
    if(file.mimetype == 'video/mp4' && fileSize <= 52282810){
      cb(null, true)
    }
    else{
      cb(new Error('Invalid Video'))
    }
  }
  else{
    if(file.fieldname = 'pdfBook'){
      if(file.mimetype == 'application/pdf' && fileSize <= 62282810){
        cb(null, true)
      }
      else{
        cb(new Error('Inavalid PDF Extention'))
      }
    }
  }


}
module.exports = multer({ storage: storage, fileFilter: fileFilter })