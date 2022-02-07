<template>
  <div class="login-signup">
    <img src="../assets/images/icon-left-font-monochrome-black.png" />

    <div class="login" v-if="showLogin">
      <h1>Créer un compte</h1>
      <form @submit="onSignUp">
        <label for="pseudo">Pseudo: </label>
        <input
          type="text"
          name="pseudo"
          id="pseudo"
          v-model="user.pseudo"
          required
        />
        <p>{{ errorFieldHandler.pseudoErrorMessage }}</p>
        <label for="mail">Email: </label>
        <input type="email" name="mail" id="mail" v-model="user.email" />
        <p>{{ errorFieldHandler.emailErrorMessage }}</p>
        <label for="pwd">Mot de passe: </label>
        <input
          type="password"
          name="pwd"
          id="pwd"
          v-model="user.password"
          required
        />
        <p>{{ errorFieldHandler.passwordErrorMessage }}</p>
        <button type="submit">S'inscrire</button>
      </form>
      <button @click="showLogin = false">Déja inscrit ?</button>
    </div>

    <div class="signup" v-else>
      <h1>Se connecter</h1>
      <form @submit="onLogin">
        <label for="mail">Email: </label>
        <input type="text" name="mail" id="mail" v-model="user.email" />
        <label for="pwd">Mot de passe: </label>
        <input type="password" name="pwd" id="pwd" v-model="user.password" />
        <button type="submit">Se connecter</button>
      </form>
      <button @click="showLogin = true">Pas encore inscrit ?</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import storageService from "../services/storageService";
import validateFieldService from "../services/validateFieldService";
export default {
  name: "Login",
  data() {
    return {
      user: {
        pseudo: "",
        email: "",
        password: "",
      },
      showLogin: true,
      errorFieldHandler: {},
    };
  },
  methods: {
    onSignUp(e) {
      e.preventDefault();
      this.errorFieldHandler = validateFieldService.validateAllFields(
        this.user
      );
      if (
        this.errorFieldHandler.emailErrorMessage ||
        this.errorFieldHandler.pseudoErrorMessage ||
        this.errorFieldHandler.passwordErrorMessage
      ) {
        return;
      }
      axios
        .post("http://localhost:3000/api/auth/signup", this.user)
        .then((res) => {
          console.log(res);
          this.onLogin(e);
        })
        .catch((error) => {
          const errorMessage = error.response.data.error.original.sqlMessage;
          console.log(errorMessage);
          if (errorMessage.match("pseudo")) {
            alert("Pseudo déjà utilisé");
          } else if (errorMessage.match("email")) {
            alert("Email déjà utilisé");
          } else {
            alert("Une erreur inconnue est survenue");
          }
        });
    },
    onLogin(e) {
      e.preventDefault();
      axios
        .post("http://localhost:3000/api/auth/login", this.user)
        .then((res) => {
          console.log(res.data);
          storageService.setUser(res.data);
          this.user.password = "";
          this.$router.push("accueil");
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    },
  },
};
</script>

<style scoped>
.login,
.signup {
  background-color: #a42900;
  padding: 10px 15px 120px 15px;
  width: 80%;
  margin: auto;
  border-radius: 15px;
  box-shadow: 1px 1px 5px grey;
}

h1 {
  color: white;
  text-shadow: black 1px 1px 4px;
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

button {
  color: white;
  margin-top: 15px;
  border: none;
  background-color: #a42900;
}

form button {
  color: #a42900;
  background-color: white;
  width: 30%;
  height: 25px;
  margin: 30px auto 0;
  padding: 0;
  border-radius: 15px;
  font-weight: bold;
  box-shadow: 1px 1px 5px grey;
}

@media screen and (min-width: 768px) {
  form {
    width: 60%;
  }
}
</style>
