export default {
  name: "ZeydP7Groupomania",
  getUser() {
    let data = localStorage.getItem(this.name);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  },
  setUser(data) {
    localStorage.setItem(this.name, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(this.name);
  },
};
