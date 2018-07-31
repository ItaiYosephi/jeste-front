const CLOUD_NAME = "jeste";

var UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

function uploadImg(imgFile) {
    // A function to be called if request succeeds
    return new Promise((resolve, reject) => {
        function onSuccess(res) {
            console.log('uploadedImg', res);
            resolve(res);
        }
        doUploadImg(imgFile, onSuccess);
    })
}

function doUploadImg(imgFile, onSuccess) {
    var formData = new FormData();
    formData.append('file', imgFile)
    formData.append('upload_preset', 'o93qhzis');

    fetch(UPLOAD_URL, { method: 'POST', body: formData })
    .then(function (response) {
        return response.json()
    })
    .then(onSuccess)
    .catch(function (error) {
        console.error(error)
    })
}

export default {
    uploadImg
}