const today = new Date();
export default {
  launchDate: new Date(2022, 0, 1),
  today: new Date(today.setDate(today.getDate() + 1)),
  minimumPrice: 1000,
  maximumPrice: 1000000,
};
