<template>
  <div class="admin">
    <Header />
    <h1 v-if="posts.length == 0">Aucun article signalé</h1>
    <ul v-else>
      <h2>Articles à examiner :</h2>
      <li v-for="(post, index) in posts" :key="post.id">
        <router-link :to="'/article-detail/' + post.id">
          <h3>{{ post.title }}</h3>
          <p class="content">{{ post.content }}</p>
          <p class="author">
            Publié par {{ post.user.pseudo }} le {{ post.createdAt }}
          </p>
        </router-link>
        <div class="admin-button">
          <button @click="confirmDeletePost(post.id, index)">Supprimer</button>
          <button @click="cancelSignalPost(post.id, index)">Rétablir</button>
        </div>
      </li>
    </ul>
    <hr />
    <h1 v-if="comments.length == 0">Aucun commentaire signalé</h1>
    <ul v-else>
      <h2>Commentaires à examiner :</h2>
      <li v-for="(comment, index) in comments" :key="comment.id">
        <router-link :to="'/article-detail/' + comment.postId">
          <p class="content">{{ comment.content }}</p>
          <p class="author">
            Publié par {{ comment.user.pseudo }} le {{ comment.createdAt }}
          </p>
        </router-link>
        <div class="admin-button">
          <button @click="confirmDeleteComment(comment.id, index)">
            Supprimer
          </button>
          <button @click="cancelSignalComment(comment.id, index)">
            Rétablir
          </button>
        </div>
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
  name: "Admin",
  data() {
    return {
      posts: [],
      comments: [],
      user: {},
    };
  },
  components: {
    Header,
  },
  mounted() {
    this.user = storageService.getUser();
    axios
      .get("http://localhost:3000/api/posts/signaled", {
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
    axios
      .get("http://localhost:3000/api/comments/signaled", {
        headers: {
          Authorization: `Basic ${this.user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.comments = res.data.map((comment) => {
          comment.createdAt = utilities.formatDate(comment.createdAt);
          return comment;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    cancelSignalPost(postId, index) {
      axios
        .get("http://localhost:3000/api/posts/unsignal/" + postId, {
          headers: {
            Authorization: `Basic ${this.user.token}`,
          },
        })
        .then(() => {
          alert("Cet article a été rétabli");
          this.posts.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelSignalComment(commentId, index) {
      axios
        .get("http://localhost:3000/api/comments/unsignal/" + commentId, {
          headers: {
            Authorization: `Basic ${this.user.token}`,
          },
        })
        .then(() => {
          alert("Ce commentaire a été rétabli");
          this.comments.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    confirmDeletePost(postId, index) {
      axios
        .delete("http://localhost:3000/api/posts/" + postId, {
          headers: {
            Authorization: `Basic ${this.user.token}`,
          },
        })
        .then(() => {
          alert("Cet article a bien été supprimé");
          this.posts.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    confirmDeleteComment(commentId, index) {
      axios
        .delete("http://localhost:3000/api/comments/" + commentId, {
          headers: {
            Authorization: `Basic ${this.user.token}`,
          },
        })
        .then(() => {
          alert("Ce commentaire a bien été supprimé");
          this.comments.splice(index, 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

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

h1 {
  color: black;
  font-size: 25px;
}

h2 {
  color: black;
  font-size: 25px;
  margin-left: -40px;
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

.admin-button {
  display: flex;
  justify-content: space-around;
}

button {
  color: white;
  margin-top: 15px;
  border: none;
  background-color: #a42900;
  border-radius: 5px 5px 0 0;
}
</style>
