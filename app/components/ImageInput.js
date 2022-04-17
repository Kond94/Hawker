import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import ImageInputCamera from "./ImageInputCamera";
import ImageInputStorage from "./ImageInputStorage";

function ImageInput({ imageURI, setImageURI }) {
  const [type, setType] = useState(null);

  return (
    <>
      {imageURI === null ? (
        <View style={{ flexDirection: "row" }}>
          <ImageInputCamera
            imageUri={imageURI}
            onChangeImage={(uri) => setImageURI(uri)}
          />
          <View style={{ marginLeft: 10 }}>
            <ImageInputStorage
              imageUri={imageURI}
              onChangeImage={(uri) => setImageURI(uri)}
            />
          </View>
        </View>
      ) : type === "camera" ? (
        <ImageInputCamera
          imageUri={imageURI}
          onChangeImage={(uri) => {
            setType("camera");
            setImageURI(uri);
          }}
        />
      ) : (
        <ImageInputStorage
          imageUri={imageURI}
          onChangeImage={(uri) => {
            setType("storage");
            setImageURI(uri);
          }}
        />
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default ImageInput;
