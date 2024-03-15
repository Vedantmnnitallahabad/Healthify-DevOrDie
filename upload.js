const multer = require('multer');

//set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now + '-' + file.originalname);
    }
});

//create multer instance
const upload = ({ storage: storage });

module.exports = upload;