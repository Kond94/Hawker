import client from "./client";

const endpoint = "/listings?populate=*";

const getListings = async () => client.get(endpoint);

const mapListings = (listings) => {
  return listings.map((listing) => {
    return {
      id: listing.id,
      title: listing.attributes.title,
      description: listing.attributes.description,
      price: listing.attributes.price,
      imageUrl: listing.attributes.images.data[0].attributes.formats.large.url,
    };
  });
};
export const addListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);

  listing.images.forEach((image, index) =>
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: image,
    })
  );

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  return client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  addListing,
  getListings,
  mapListings,
};
