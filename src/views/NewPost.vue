<template>
  <div class="new-post">
    <Header />
    <div class="new-post-form">
      <h1>Ajouter un article</h1>
      <form @submit="onCreatePost">
        <label for="title">Titre: </label>
        <input type="text" name="title" id="title" v-model="post.title" />
        <label for="content">Contenu: </label>
        <textarea
          name="content"
          id="content"
          cols="80"
          rows="5"
          v-model="post.content"
        ></textarea>
        <button type="submit">Poster</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import storageService from "../services/storageService";
import Header from "../components/Header.vue";

export default {
  components: {
    Header,
  },
  name: "NewPost",
  data() {
    return {
      post: {
        title: "",
        content: "",
        userId: "",
      },
    };
  },
  methods: {
    onCreatePost(e) {
      e.preventDefault();
      const userData = storageService.getUser();
      this.post.userId = userData.userId;
      axios
        .post(
          "http://localhost:3000/api/posts/",
          { post: this.post },
          {
            headers: {
              Authorization: `Basic ${userData.token}`,
            },
          }
        )
        .then((res) => {
          this.$router.push("accueil");
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
h1 {
  color: white;
  text-shadow: black 1px 1px 4px;
}

.new-post-form {
  background-color: #a42900;
  padding: 10px 15px 120px 15px;
  width: 80%;
  margin: auto;
  border-radius: 15px;
  box-shadow: 1px 1px 5px grey;
}

form {
  display: flex;
  flex-direction: column;
  margin: auto;
  font-weight: bold;
}

label {
  color: white;
  margin-top: 15px;
}

input {
  height: 20px;
  border-radius: 5px;
}

textarea {
  border-radius: 5px;
}

button {
  color: white;
  margin-top: 15px;
  background-color: #a42900;
}

form button {
  color: #a42900;
  background-color: white;
  width: 30%;
  height: 25px;
  margin: 30px auto 0;
  border-radius: 15px;
  font-weight: bold;
}

@media screen and (min-width: 768px) {
  form {
    width: 60%;
  }
}
</style>
