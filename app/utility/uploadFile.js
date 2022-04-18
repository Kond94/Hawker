import storage from "@react-native-firebase/storage";
import { v4 as uuidv4 } from "uuid";

let UploadFile = async function (
  uri,
  setRemoteUrl,
  setUploadProgress,
  setIsUploading
) {
  setIsUploading(true);

  const ref = uuidv4();
  const reference = storage().ref("/Images/" + ref);

  const task = reference.putFile(uri);

  task.on("state_changed", (taskSnapshot) => {
    const progress =
      (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
    setUploadProgress(progress);
  });

  task.then(async (res) => {
    const downloadUrl = await task.snapshot.ref.getDownloadURL();
    setRemoteUrl(downloadUrl);
    setIsUploading(false);
  });
};

export default UploadFile;
