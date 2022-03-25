import apiClient from "./client";
import client from "./client";
import { v4 as uuidv4 } from "uuid";
import { stringify } from "uuid";

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

const addListing = (listing, onUploadProgress) => {
  const listingData = {
    title: listing.title,
    description: listing.description,
    price: listing.price,
  };
  return client
    .post(
      "/listings",
      { data: listingData },
      {
        onUploadProgress: (progress) =>
          onUploadProgress(progress.loaded / progress.total),
      }
    )
    .then((result) => {
      const data = new FormData();

      listing.images.forEach((image) => {
        data.append("files", {
          uri: image,
          name: uuidv4(),
          type: "image/jpeg",
        });
      });
      data.append("refId", result.data.data.id);
      data.append("ref", "api::listing.listing");
      data.append("field", "images");

      return client.post("/upload", data, {
        onUploadProgress: (progress) =>
          onUploadProgress(progress.loaded / progress.total),
      });
    });
};

export default {
  addListing,
  getListings,
  mapListings,
};
