const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')

const storage = new GridFsStorage({
    url:process.env.DB_KEY,
    options: {useNewUrlParser:true, useUnifiedTopology:true},
    file:(req,file) => {
        const match = ["image/png", "image/jpeg"];

        if(match.indexOf(file.mimetype) === -1){
            //ne ez legyem majd a neve hanem a user ._id!
            const filename = `${Date.now()}-profile-${file.originalname}`;
            return filename
        }

        return{
            bucketName:"photos",
            //ne ez legyem majd a neve hanem a user ._id!
            filename: `${Date.now()}-profile-${file.originalname}`
        }
    }
})

module.exports = multer({storage})