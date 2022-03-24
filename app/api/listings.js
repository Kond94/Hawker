import apiClient from "./client";
import client from "./client";
import { v4 as uuidv4 } from "uuid";

const endpoint = "/listings?populate=*";

const getListings = async () => client.get(endpoint);

const mapListings = (listings) => {
  return listings.map((listing) => {
    return {
      id: listing.id,
      title: listing.attributes.title,
      description: listing.attributes.description,
      price: listing.attributes.price,
      images: listing.attributes.images.data.map((image) => {
        return {
          id: image.id,
          url:
            apiClient.getBaseURL().replace("/api", "") +
            image.attributes.formats.large.url,
        };
      }),
    };
  });
};
export const addListing = (listing, onUploadProgress) => {
  // listing = {
  //   ...listing,
  //   images: listing.images.map((image) => {
  //     return { name: uuidv4(), type: "image/jpeg", uri: image };
  //   }),
  // };
  const data = {
    data: {
      title: listing.title,
      price: listing.price,
      description: listing.description,
    },
  };

  // if (listing.location)
  //   data.append("location", JSON.stringify(listing.location));

  return client
    .post("/listings", data, {
      onUploadProgress: (progress) =>
        onUploadProgress(progress.loaded / progress.total),
    })
    .then((res) => {
      // const imageData = new FormData();

      // imageData.append("files", listing.images);
      // imageData.append("refId", res.data.data.id);
      // imageData.append("ref", "listing");
      // imageData.append("field", "images");
      const imageData = {
        files: listing.images,
        refId: res.data.data.id,
        ref: "listing",
        field: "images",
      };
      client
        .post("/upload/", imageData, {
          onUploadProgress: (progress) =>
            onUploadProgress(progress.loaded / progress.total),
        })
        .then((res) => {
          console.log("result: ", res);
        });
    });
};

export default {
  addListing,
  getListings,
  mapListings,
};
