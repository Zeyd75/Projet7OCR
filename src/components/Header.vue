<template>
  <div class="header">
    <img
      src="../assets/images/icon-left-font-monochrome-black.png"
      alt="logo"
    />
    <div id="nav">
      <router-link to="/accueil">Accueil</router-link>
      <router-link to="/nouvel-article">Nouvel article</router-link>
      <router-link to="/mon-profil">Mon profil</router-link>
      <router-link v-if="user.isAdmin" to="/administration"
        >Administration</router-link
      >
      <div class="connect-button">
        <button @click="logout" v-if="user">Se déconnecter</button>
        <router-link to="/" v-else>Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import storageService from "../services/storageService";

export default {
  name: "Header",
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    this.user = storageService.getUser();
  },
  methods: {
    logout() {
      storageService.clear();
      this.$router.push("/");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nav {
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  flex-wrap: wrap;
}

#nav a {
  color: #a42900;
}

button {
  color: white;
  margin-top: 15px;
  border: none;
  background-color: #a42900;
  border-radius: 15px;
}
</style>
