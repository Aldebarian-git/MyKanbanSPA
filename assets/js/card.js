import api from "./api.js";
import dragAndDrop from "./dragAndDrop.js";
import modal from "./modal.js";
import toast from "./toast.js";

const card = {
  init() {
    this.bind();
  },

  bind() {
    // On sélectionne le formulaire de la modal d'ajout de carte et on lui attache un event submit
    document
      .querySelector("#add-card-modal form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleAddCard(event);
      });

    document
      .querySelector("#edit-card-modal form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleEditCard(event);
      });

    document
      .querySelector("#delete-card-modal form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleDeleteCard(event);
      });
  },

  async handleAddCard(event) {
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const listId = document.querySelector("#add-card-modal").dataset.listId;

    data.list_id = listId;

    if (!data.content || data.content === "") {
      toast.error("Veuillez saisir un contenu pour la carte !");
      return;
    }

    if (!listId) {
      toast.error("Impossible de créer la carte !");
      return;
    }

    const createdCard = await api.createCard(data);

    if (createdCard === null) {
      toast.error("Impossible de créer la carte !");
      return;
    }

    this.addCardToListOnDOM(createdCard);
    form.reset();
    modal.close("#add-card-modal");
    toast.success("Carte créée !");
    // On initialise le drag and drop des cartes et des listes
    dragAndDrop.handleDragAndDropCard();
    dragAndDrop.handleDragAndDropList();
  },

  async handleDeleteCard(event) {
    const form = event.currentTarget;
    if (form) {
      const cardId =
        document.querySelector("#delete-card-modal").dataset.cardId;

      const deleteResult = await api.deleteCard(cardId);
      if (deleteResult === null) {
        toast.error("Impossible de supprimer la carte !");
        return;
      }
      const cardToDeleteOnDOM = document.querySelector(
        `[data-card-id="${cardId}"]`
      );
      if (cardToDeleteOnDOM) {
        cardToDeleteOnDOM.remove();
      }

      modal.close("#delete-card-modal");
      toast.success("Carte supprimée !");
    }
  },

  async handleEditCard(event) {
    const form = event.currentTarget;
    const cardId = document.querySelector("#edit-card-modal").dataset.cardId;
    const data = Object.fromEntries(new FormData(form));

    if (!data.content || data.content === "") {
      toast.error("Veuillez saisir un contenu pour la carte !");
      return;
    }

    const updatedCard = await api.updateCard(cardId, data);

    if (updatedCard === null) {
      toast.error("Impossible de modifier la carte !");
      return;
    }

    document.querySelector(
      `[data-card-id="${cardId}"] .card-header-title`
    ).textContent = data.content;

    form.reset();

    modal.close("#edit-card-modal");

    toast.success("Carte modifiée !");
  },

  addCardToListOnDOM(card) {
    const listElement = document.querySelector(
      `[data-list-id="${card.list_id}"]`
    );
    const cardTemplate = document.getElementById("card-template");
    const cloneCard = cardTemplate.content.cloneNode(true);

    cloneCard.querySelector(".card-header-title").textContent = card.content;
    cloneCard.querySelector(".card").dataset.cardId = card.id;
    cloneCard.querySelector(".card").dataset.listId = card.list_id;
    cloneCard.querySelector(".card").dataset.cardPosition = card.position;

    // Ajout de l'event listener pour la suppression
    cloneCard
      .querySelector(".delete-card-button")
      .addEventListener("click", () => {
        this.handleDeleteCard(card.id);
      });

    // Ajout de l'event listener pour l'édition
    cloneCard
      .querySelector(".edit-card-button")
      .addEventListener("click", () => {
        document.querySelector("#edit-card-modal").dataset.cardId = card.id;
        modal.open("#edit-card-modal");
      });

    cloneCard
      .querySelector(".delete-card-button")
      .addEventListener("click", () => {
        document.querySelector("#delete-card-modal").dataset.cardId = card.id;
        modal.open("#delete-card-modal");
      });

    listElement.querySelector(".message-body").append(cloneCard);
  },
};

export default card;
