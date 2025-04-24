const path = require('path');


const uploadSingleFile = async (fileObject) => {

    // const newPath = path.join(__dirname, '..', 'public', 'images', 'upload');
    // // Sử dụng newPath để tạo đường dẫn mong muốn
    // let uploadPath = path.join(newPath, fileObject.name);
    // console.log(">> check __dirname: ", uploadPath);
    // ------------------------------------------------------------------------
    
    // save => public/images/upload
    // remember to create the upload folder first
    let uploadPath = path.resolve(__dirname, "../public/images/upload/")

    // get img extension
    let extName = path.extname(fileObject.name)

    // get image's name 
    let baseName = path.basename(fileObject.name, extName)

    // create final path: eg: /upload/your-image.png
    let finalName = `${baseName}-${Date.now()}${extName}`
    let finalPath = `${uploadPath}/${finalName}`

    console.log(">>> finalPath: ",finalPath);

    try{
        await fileObject.mv(finalPath)
        let relativePath = finalPath.replace(path.resolve(__dirname, "../public"), "");
        return {
            status: "thanh cong",
            path: relativePath,
            error: null
        }
    }catch(err) {
        console.log(">> check err: ", err);
        return {
            status: "that bai",
            path: null,
            error: JSON.stringify(err)
        }
    }
}

const uploadMultipleFiles = async (filesArr) => {
    try {
        let uploadPath = path.resolve(__dirname, "../public/images/upload/");
        let resultArr = [];
        let countSuccess = 0;

        for (let i = 0; i < filesArr.length; i++) {
            // Get image extension
            let extName = path.extname(filesArr[i].name);

            // Get image's name 
            let baseName = path.basename(filesArr[i].name, extName);

            // Create final path: eg: /upload/your-image.png
            let finalName = `${baseName}-${Date.now()}${extName}`;
            let finalPath = `${uploadPath}/${finalName}`; // Ensure correct path for Unix systems

            try {
                await filesArr[i].mv(finalPath);
                resultArr.push({
                    status: "thanh cong",
                    path: `/images/upload/${finalName}`, // Store relative path
                    fileName: filesArr[i].name,
                    error: null
                });
                countSuccess++;

            } catch (err) {
                console.log(">> check err: ", err);
                resultArr.push({
                    status: "that bai",
                    path: null,
                    fileName: filesArr[i].name,
                    error: JSON.stringify(err)
                });
            }
        }

        return {
            countSuccess: countSuccess,
            detail: resultArr
        };

    } catch (error) {
        console.log("error: ", error);
    }
};

module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,

}