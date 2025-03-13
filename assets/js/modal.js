/**
 * Gestion des modals générique
 * @namespace modal
 */
const modal = {
  /**
   * Initialise les écouteurs d'événements sur les boutons de fermeture des modals
   */
  init() {
    document.querySelectorAll(".close").forEach((element) => {
        element.addEventListener("click", () => modal.close());
      });
  },

  /**
   * Ouvre un modal en se basant sur le selecteur passé en paramètre
   * @param {String} selector Le selecteur du modal à ouvrir
   */
  open(selector) {
    document.querySelector(selector).showModal();
  },

  /**
   * Ferme le modal en cours
   * @param {String} selector Le selecteur du modal à fermer, par défaut c'est dialog[open] qui est la première balise dialog ouverte
   */
  close(selector = "dialog[open]") {
    const element = document.querySelector(selector);
    if (element) {
      element.close();
    } else {
      console.error(`Modal non trouvé avec le sélecteur : ${selector}`);
    }
  },
};

export default modal;
