import ErrorMessage from "./ErrorMessage";
import ImageInputList from "../ImageInputList";
import React from "react";
import { UploadFile } from "../../utility/uploadFile";
import UploadScreen from "../../screens/UploadScreen";
import { useFormikContext } from "formik";
import { useState } from "react";

function FormImagePicker({ name, setURL }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUris = values[name];
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(uri) {
    setIsUploading(true);
    if (uri === null) return setProfilePhotoURL(null);
    setFieldValue(name, [
      ...imageUris,
      await UploadFile(uri, "/Listing_Images/"),
    ]);
    setIsUploading(false);
  }

  const handleAdd = async (uri) => {
    await uploadImage(uri);
  };

  const handleRemove = (uri) => {
    setFieldValue(
      name,
      imageUris.filter((imageUri) => imageUri !== uri)
    );
  };

  return (
    <>
      <UploadScreen
        progress={0}
        onDone={() => setIsUploading(false)}
        visible={isUploading}
      />
      <ImageInputList
        imageUris={imageUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormImagePicker;
