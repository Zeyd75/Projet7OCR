export default {
  pseudoIsValid(pseudo) {
    return {
      ok: pseudo.length >= 2,
      errorMessage: "Le pseudo doit contenir minimum 2 caractères",
    };
  },
  emailIsValid(email) {
    const regexEmail = new RegExp(
      "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
      "g"
    );
    return {
      ok: regexEmail.test(email),
      errorMessage: "Le  format de l'email est invalide",
    };
  },
  passwordIsValid(password) {
    return {
      ok: password.length >= 6,
      errorMessage: "Le mot de passe doit contenir minimum 6 caractères",
    };
  },
  validateAllFields({ pseudo, email, password }) {
    const _pseudoIsValid = this.pseudoIsValid(pseudo);
    const pseudoErrorMessage = _pseudoIsValid.ok
      ? ""
      : _pseudoIsValid.errorMessage;
    const _emailIsValid = this.emailIsValid(email);
    const emailErrorMessage = _emailIsValid.ok
      ? ""
      : _emailIsValid.errorMessage;
    const _passwordIsValid = this.passwordIsValid(password);
    const passwordErrorMessage = _passwordIsValid.ok
      ? ""
      : _passwordIsValid.errorMessage;
    return {
      pseudoErrorMessage,
      emailErrorMessage,
      passwordErrorMessage,
      hasErrors:
        pseudoErrorMessage.length > 0 ||
        emailErrorMessage.length > 0 ||
        passwordErrorMessage.length > 0,
    };
  },
};
