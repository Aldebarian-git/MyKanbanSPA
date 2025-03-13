import modal from "./modal.js";
import api from "./api.js";
import card from "./card.js";
import toast from "./toast.js";
import dragAndDrop from "./dragAndDrop.js";

const list = {
  init() {
    this.bind();
    this.loadLists();
  },

  bind() {
    // On sélectionne le bouton pour ajouter une liste et on écoute le clic dessus
    document
      .getElementById("add-list-button")
      .addEventListener("click", () => modal.open("#add-list-modal"));

    // On selectionne le formulaire de la modal d'ajout de list et on lui attache un event submit
    document
      .querySelector("#add-list-modal form")
      .addEventListener("submit", this.handleAddList.bind(this));

    // On selectionne le formulaire de la modal d'edition de list et on lui attache un event submit
    document
      .querySelector("#edit-list-modal form")
      .addEventListener("submit", this.handleEditList.bind(this));

    // On selectionne le formulaire de la modal de suppression de list et on lui attache un event submit
    document
      .querySelector("#delete-list-modal form")
      .addEventListener("submit", this.handleDeleteList.bind(this));    

  },

  async loadLists() {
    // On a envie de voir les listes de notre kanban le plus vite possible, sans faire d'action particulière, juste une fois que la page est chargée.
    // Du coup, dés le init, on va appeler l'API de récupération de nos listes.
    const lists = await api.getLists();

    // On vérifie qu'on a bien récupérer des lists avant de faire la suite
    if (lists === null) {
      toast.error("Impossible de charger les listes !");
      return;
    }

    // On va boucler sur l'ensemble de nos listes, puis on va les ajouter au DOM
    lists.forEach((list) => this.addListToDOM(list));

    // On initialise le drag and drop des listes
    dragAndDrop.handleDragAndDropList();

    // On initialise le drag and drop des cartes
    dragAndDrop.handleDragAndDropCard();
  },

  async handleAddList(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (!data.position) {
      data.position =
        document.querySelectorAll('[data-type="list"]').length + 1;
    }

    const createdList = await api.createList(data);

    if (createdList === null) {
      toast.error("Impossible de créer la liste !");
      return;
    }

    this.addListToDOM(createdList);
    modal.close();
    form.reset();
    toast.success("Liste créée!");
  },

  async handleEditList(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const listId = document.querySelector("#edit-list-modal").dataset.listId;

    const updatedList = await api.updateList(listId, data);

    if (updatedList === null) {
      toast.error("Impossible de modifier la liste !");
      return;
    }

    const listElement = document.querySelector(`[data-list-id="${listId}"]`);
    listElement.querySelector('[slot="list-title"]').textContent =
      updatedList.title;

    modal.close();
    form.reset();
    toast.success("Liste modifiée !");
  },

  async handleDeleteList(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (form) {
      const listId =
        document.querySelector("#delete-list-modal").dataset.listId;

      try {
        const deleteResult = await api.deleteList(listId);

        if (deleteResult === null) {
          toast.error("Impossible de supprimer la liste !");
          throw new Error("Échec de la suppression de la liste.");
        }

        const listToDeleteOnDOM = document.querySelector(
          `[data-list-id="${listId}"]`
        );
        if (listToDeleteOnDOM) {
          listToDeleteOnDOM.remove();
        }

        modal.close();
        toast.success("Liste supprimée !");
      } catch (error) {
        console.error("Erreur lors de la suppression de la liste :", error);
        toast.error("Impossible de supprimer la liste. Veuillez réessayer.");
      }
    }
  },

  addListToDOM(list) {
    const template = document.getElementById("list-template");
    const clone = template.content.cloneNode(true);

    clone.querySelector('[slot="list-title"]').textContent = list.title;
    clone.querySelector("section.message.is-info").dataset.listId = list.id;
    clone.querySelector("section.message.is-info").dataset.position = list.position;
    clone.querySelector(".message-body").dataset.listId = list.id;

    // Gestion des boutons d'action
    clone.querySelector(".edit-list-button").addEventListener("click", () => {
      document.querySelector("#edit-list-modal").dataset.listId = list.id;
      modal.open("#edit-list-modal");
    });

    clone.querySelector(".delete-list-button").addEventListener("click", () => {
      modal.open("#delete-list-modal");
      document.querySelector("#delete-list-modal").dataset.listId = list.id;
    });

    clone.querySelector(".add-card-button").addEventListener("click", () => {
      document.querySelector("#add-card-modal").dataset.listId = list.id;
      modal.open("#add-card-modal");
    });   

    // On ajoute d'abord la liste au DOM
    document.getElementById("lists-container").append(clone);

    // Ensuite, on ajoute les cartes
    if (list.cards) {
      list.cards.forEach((cardData) => {
        card.addCardToListOnDOM(cardData);
      });
    }
  },
};

export default list;
