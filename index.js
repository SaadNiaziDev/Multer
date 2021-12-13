const express = require('express');
const multer = require('multer');
const path = require('path');


//storage having 2 attributes, one for destination and one for filename
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//init storage

const upload = multer ({
    storage : storage,
    limits:{fileSize:100*1000*1000},
    fileFilter: function (req,file,cd){
        checkFileExtension(file,cd);
    }
}).single('1234');


//file extension checking
function checkFileExtension(file,cd){
    //declaring file types
    const filetype = /jpeg|png|gif|jpg/;
    //extracting file extension
    const extname = filetype.test(path.extname(file.originalname).toLowerCase());
    //mapping mimetype
    const mimetype = filetype.test(file.mimetype);

    if(mimetype && extname ){
        return cd(null, true);
    }
    else{
        return cd('Error: Images type only!');
    }
}

const app = express();

app.use(express.static("./public"));


app.get('/', (req, res) => {
    console.log("Running");
    res.send("hey");
})

app.post('/uploads', (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                res.send(err);
            }
            else {
                console.log(req.file);
                res.send('file uploaded successfully');
            }
        });
    })

app.listen(3000);


