<template>
  <div class="edit-profile">
    <Header />
    <div class="edit-profile-form">
      <h1>Modifier votre compte</h1>
      <form @submit="onEdit">
        <label for="pseudo"
          >Nouveau pseudo: <span>(Pseudo actuel : {{ user.old_pseudo }})</span>
        </label>
        <input
          type="text"
          name="new_pseudo"
          id="pseudo"
          v-model="user.new_pseudo"
          required
        />
        <p>{{ errorFieldHandler.pseudoErrorMessage }}</p>
        <label for="mail"
          >Nouvel email:
          <span>(Email actuel : {{ user.old_email }})</span></label
        >
        <input
          type="text"
          name="new_mail"
          id="mail"
          v-model="user.new_email"
          required
        />
        <p>{{ errorFieldHandler.emailErrorMessage }}</p>
        <label for="pwd">Nouveau mot de passe: </label>
        <input
          type="password"
          name="new_pwd"
          id="pwd"
          v-model="user.new_password"
        />
        <p v-if="user.new_password">
          {{ errorFieldHandler.passwordErrorMessage }}
        </p>
        <div
          class="old-password"
          v-if="user.new_pseudo || user.new_email || user.new_password"
        >
          <label for="pwd">Renseignez votre ancien mot de passe: </label>
          <input
            type="password"
            name="pwd"
            id="pwd"
            v-model="user.old_password"
            required
          />
          <p v-if="!user.old_password">
            Veuillez renseigner votre mot de passe actuel afin de modifier votre
            profil
          </p>
          <button type="submit">Modifier mon profil</button>
        </div>
      </form>
    </div>
    <button @click="showModal = true" class="delete-button">
      Supprimer mon profil
    </button>
    <ModalInput
      v-if="showModal"
      title="Êtes-vous sûr de vouloir supprimer votre compte ?"
      content="Saisissez votre mot de passe pour confirmer"
      @close="showModal = false"
      @output="deleteAccount"
    />
  </div>
</template>

<script>
import axios from "axios";
import storageService from "../services/storageService";
import validateFieldService from "../services/validateFieldService";
import Header from "../components/Header.vue";
import ModalInput from "../components/ModalInput.vue";
export default {
  name: "EditProfile",
  components: {
    Header,
    ModalInput,
  },
  data() {
    return {
      user: {
        id: "",
        old_pseudo: "",
        old_email: "",
        old_password: "",
        new_pseudo: "",
        new_email: "",
        new_password: "",
      },
      errorFieldHandler: {},
      showModal: false,
      userData: {},
    };
  },
  methods: {
    onEdit(e) {
      e.preventDefault();
      const user = {
        pseudo: this.user.new_pseudo || this.user.old_pseudo,
        email: this.user.new_email || this.user.old_email,
        password: this.user.new_password,
      };
      this.errorFieldHandler = validateFieldService.validateAllFields(user);
      if (
        this.errorFieldHandler.emailErrorMessage ||
        this.errorFieldHandler.pseudoErrorMessage ||
        (this.user.new_password && this.errorFieldHandler.passwordErrorMessage)
      ) {
        return;
      }
      this.user.id = storageService.getUser().userId;
      axios
        .post("http://localhost:3000/api/auth/update", this.user, {
          headers: {
            Authorization: `Basic ${this.userData.token}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (this.user.new_pseudo) {
            this.user.old_pseudo = this.user.new_pseudo;
            this.user.new_pseudo = "";
          }
          if (this.user.new_email) {
            this.user.old_email = this.user.new_email;
            this.user.new_email = "";
          }
          if (this.user.new_password) {
            this.user.old_password = this.user.new_password;
            this.user.new_password = "";
          }
        })
        .catch((error) => {
          console.log(error);
          //   const errorMessage = error.response.data.error.original.sqlMessage;
          //   if (errorMessage.match("pseudo")) {
          //     alert("Pseudo déjà utilisé");
          //   } else if (errorMessage.match("email")) {
          //     alert("Email déjà utilisé");
          //   } else {
          //     alert("Une erreur inconnue est survenue");
          //   }
        });
    },
    deleteAccount($event) {
      const userId = this.userData.userId;
      axios
        .post(
          "http://localhost:3000/api/auth/delete/" + userId,
          {
            password: $event.output,
          },
          {
            headers: {
              Authorization: `Basic ${this.userData.token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          storageService.clear();
          this.$router.push("/");
          alert("Votre compte a bien été supprimé.");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.userData = storageService.getUser();
    axios
      .get("http://localhost:3000/api/auth/getUser/" + this.userData.userId, {
        headers: {
          Authorization: `Basic ${this.userData.token}`,
        },
      })
      .then((res) => {
        this.user.id = this.userData.userId;
        this.user.old_pseudo = res.data.pseudo;
        this.user.old_email = res.data.email;
        console.log(this.user);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.edit-profile-form {
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

.old-password {
  margin-top: 15px;
}

form button {
  color: #a42900;
  background-color: white;
  width: 60%;
}

.delete-button {
  color: white;
  background-color: #a42900;
  width: 50%;
}

form button,
.delete-button {
  height: 25px;
  margin: 30px auto 0;
  border-radius: 15px;
  font-weight: bold;
}

label {
  color: white;
  margin-top: 15px;
}

span {
  font-weight: normal;
}

input {
  height: 20px;
  border-radius: 5px;
}

p {
  color: white;
  font-weight: normal;
}

@media screen and (min-width: 768px) {
  form {
    width: 60%;
  }

  .delete-button {
    width: 30%;
  }
}
</style>
