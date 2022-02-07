export default {
  formatDate(str) {
    const shortenDate = str.split(".")[0];
    const dates = shortenDate.split("T");
    const dateLeft = dates[0].split("-").reverse().join("/");
    return dateLeft + " à " + dates[1];
  },
};
