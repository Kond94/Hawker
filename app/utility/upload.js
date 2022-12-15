import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { v4 as uuidv4 } from "uuid";

let uploadImages = (uri, folder, setIsUploading, setDownloadUrl) => {
  return new Promise(async (resolve, reject) => {
    setIsUploading(true);
    const storage = getStorage();

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, folder + uuidv4());

    let self = this;
    this.uri.forEach((image) => {
      const blob = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        {
          error: (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                setIsUploading(false);

                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                setIsUploading(false);

                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                setIsUploading(false);

                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          complete: () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setIsUploading(false);
              console.log(downloadURL);
              setDownloadUrl(downloadURL);
              resolve();
            });
          },
        }
      );
    });
  });
};

export default uploadImages;
