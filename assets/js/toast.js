import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const toast = {
  init() {
    iziToast.settings({
      position: "topRight",
      timeout: 5000,               
    });
  },

  success(message) {
    iziToast.success({
      title: "Succès",
      message: message,
    });
  },
  error(message) {
    iziToast.error({
      title: "Erreur",
      message: message,
    });
  },
  warning(message) {
    iziToast.warning({
      title: "Attention",
      message: message,
    });
  },
  info(message) {
    iziToast.info({
      title: "Information",
      message: message,
    });
  },
};

export default toast;
