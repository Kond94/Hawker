import storage from "@react-native-firebase/storage";
import { v4 as uuidv4 } from "uuid";

let UploadFile = async function (uri, setIsUploading) {
  setIsUploading(true);

  const ref = uuidv4();
  const reference = storage().ref("/Images/" + ref);

  const task = await reference.putFile(uri);

  const downloadUrl = await storage()
    .ref("/Images/" + ref)
    .getDownloadURL();
  setIsUploading(false);
  return downloadUrl;
};

export default UploadFile;
