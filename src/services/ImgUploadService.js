const CLOUD_NAME = "jeste";

var UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

function uploadImg(imgFile) {
    var formData = new FormData();
    formData.append('file', imgFile)
    formData.append('upload_preset', 'o93qhzis');

    return fetch(UPLOAD_URL, { method: 'POST', body: formData })
    .then(function (response) {
        return response.json()
    })
    .then(res => res)
    .catch(function (error) {
        console.error(error)
    })
}

export default {
    uploadImg
}