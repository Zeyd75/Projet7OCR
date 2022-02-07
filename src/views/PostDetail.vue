<template>
  <div class="post-detail">
    <Header />
    <article class="posted-article">
      <h3>{{ post.title }}</h3>
      <p class="content">{{ post.content }}</p>
      <p class="author">Publié par {{ post.user.pseudo }}</p>
    </article>
    <article class="comment">
      <h3>Commentaires</h3>
      <ul>
        <li v-for="comment in comments" :key="comment.id">
          <span>
            <p class="content">{{ comment.content }}</p>
            <p class="author">
              Publié par {{ comment.user.pseudo }} le {{ comment.createdAt }}
            </p>
          </span>
          <button
            @click="signalComment(comment.id, index)"
            v-if="comment.userId != user.userId && !comment.isSignaled"
          >
            Signaler
          </button>
        </li>
      </ul>
      <form @submit="onSubmitComment">
        <label for="commentaries">Publier un commentaire: </label>

        <textarea
          name="commentaries"
          id="commentaries"
          cols="80"
          rows="5"
          v-model="newComment.content"
        ></textarea>
        <button type="submit">Publier</button>
      </form>
    </article>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import axios from "axios";
import utilities from "../services/utilities";
import storageService from "../services/storageService";

export default {
  name: "PostDetail",
  data() {
    return {
      comments: [],
      post: {
        title: "",
        content: "",
        createdAt: null,
        user: {
          pseudo: "",
        },
      },
      newComment: {
        content: "",
        userId: "",
        postId: "",
      },
      user: {
        id: "",
        token: "",
      },
    };
  },
  components: {
    Header,
  },
  mounted() {
    this.user = storageService.getUser();
    axios
      .get("http://localhost:3000/api/posts/getOne/" + this.$route.params.id, {
        headers: {
          Authorization: `Basic ${this.user.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        this.post = res.data;
      })
      .catch((error) => {
        console.log(error);
      });
    this.getAllComments();
  },
  methods: {
    onSubmitComment(e) {
      e.preventDefault();
      this.newComment.postId = this.$route.params.id;
      this.newComment.userId = storageService.getUser().userId;
      axios
        .post(
          "http://localhost:3000/api/comments/",
          {
            comment: this.newComment,
          },
          {
            headers: {
              Authorization: `Basic ${this.user.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.newComment.content = "";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAllComments() {
      axios
        .get(
          "http://localhost:3000/api/comments/getAll/" + this.$route.params.id,
          {
            headers: {
              Authorization: `Basic ${this.user.token}`,
            },
          }
        )
        .then((res) => {
          this.comments = res.data.map((comment) => {
            comment.createdAt = utilities.formatDate(comment.createdAt);
            return comment;
          });
          console.log(res.data);
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
article {
  width: 80%;
  margin: 25px auto;
  border: solid #a42900 4px;
  border-radius: 10px;
}

h3 {
  color: white;
  background-color: #a42900;
  padding: 10px;
  margin-top: -2px;
  text-shadow: black 1px 1px 4px;
}

ul {
  color: white;
  margin: auto;
}

li {
  background-color: white;
  color: white;
  margin-left: -40px;
  margin-top: 25px;
  border-radius: 10px;
  box-shadow: 1px 1px 4px black;
}

li span {
  color: black;
}

.content {
  font-size: 18px;
  padding: 0 10px;
}

.author {
  font-size: 12px;
}

.comment {
  background-color: #a42900;
  padding: 15px 0;
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

textarea {
  border-radius: 5px;
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

button {
  color: #fff;
  margin-top: 15px;
  background-color: #fd2900;
  border-radius: 5px 5px 0 0;
}

@media screen and (min-width: 768px) {
  ul {
    width: 55%;
  }

  form {
    width: 60%;
  }
}
</style>
