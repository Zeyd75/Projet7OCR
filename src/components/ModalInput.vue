<template>
  <div class="modal">
    <div id="modalContainer">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <input type="password" v-model="output" />
      <button class="submitOutputButton" @click="emitOutput">Valider</button>
      <button class="submitOutputButton" @click="close">Annuler</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalInput",
  data() {
    return {
      output: "",
    };
  },
  props: ["title", "content"],
  methods: {
    emitOutput() {
      this.$emit("output", {
        output: this.output,
      });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 4;
}

#modalContainer {
  color: #000;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 1px 1px 4px silver;
}

input,
button {
  margin: 0 4px;
}

button {
  color: white;
  margin-top: 15px;
  border: none;
  background-color: #a42900;
  border-radius: 15px;
}
</style>
