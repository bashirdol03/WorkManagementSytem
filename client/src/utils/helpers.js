import moment from "moment";

export const getDateFormat = (date) => {
  return moment(date).format("MMMM Do YYYY, h:mm A");
}