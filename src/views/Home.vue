<template>
  <div class="home">
    <Header />
    <h1 v-if="posts.length == 0">Aucun article à afficher</h1>
    <ul v-else>
      <li v-for="(post, index) in posts" :key="post.id">
        <router-link :to="'/article-detail/' + post.id">
          <h3>{{ post.title }}</h3>
          <p class="content">{{ post.content }}</p>
          <p class="author">
            Publié par {{ post.user.pseudo }} le {{ post.createdAt }}
          </p>
        </router-link>
        <button
          @click="signalPost(post.id, index)"
          v-if="post.userId != user.userId && !post.isSignaled"
        >
          Signaler
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import axios from "axios";
import utilities from "../services/utilities";
import storageService from "../services/storageService";

export default {
  name: "Home",
  data() {
    return {
      posts: [],
      user: "",
    };
  },
  components: {
    Header,
  },
  mounted() {
    this.user = storageService.getUser();
    axios
      .get("http://localhost:3000/api/posts", {
        headers: {
          Authorization: `Basic ${this.user.token}`,
        },
      })
      .then((res) => {
        this.posts = res.data.map((post) => {
          post.createdAt = utilities.formatDate(post.createdAt);
          return post;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    signalPost(postId, index) {
      axios
        .get("http://localhost:3000/api/posts/signal/" + postId, {
          headers: {
            Authorization: `Basic ${this.user.token}`,
          },
        })
        .then(() => {
          alert("Cet article a été signalé");
          this.posts[index].isSignaled = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    signalComment(commentId, index) {
      axios
        .get("http://localhost:3000/api/comments/signal/" + commentId, {
          headers: {
            Authorization: `Basic ${this.user.token}`,
          },
        })
        .then(() => {
          alert("Ce commentaire a été signalé");
          this.comments[index].isSignaled = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
ul {
  width: 75%;
  margin: auto;
}

li {
  list-style: none;
  margin-left: -40px;
  margin-top: 25px;
  border: solid #a42900 4px;
  border-radius: 10px;
  box-shadow: 1px 1px 4px silver;
}

a {
  text-decoration: none;
  color: black;
}

h3 {
  color: white;
  background-color: #a42900;
  padding: 10px;
  margin-top: -2px;
  text-shadow: black 1px 1px 4px;
}

.content {
  font-size: 18px;
  padding: 0 10px;
}

.author {
  font-size: 12px;
}

button {
  color: white;
  margin-top: 15px;
  border: none;
  background-color: #a42900;
  border-radius: 5px 5px 0 0;
}
</style>
