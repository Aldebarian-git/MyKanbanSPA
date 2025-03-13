import api from "./api.js";
import toast from "./toast.js";
const dragAndDrop = {
  async handleDragAndDropList() {
    const listsContainer = document.querySelector("#lists-container");

    if (!listsContainer) {
      console.error(
        "Erreur : Le conteneur des listes (#lists-container) est introuvable !"
      );
      return;
    }
    new Sortable(listsContainer, {
      animation: 150,
      ghostClass: "sortable-ghost",
      handle: ".drag-button",      
      onEnd: async (evt) => {
        const lists = document.querySelectorAll("[data-type='list']");
    
        // Récupérer toutes les listes et mettre à jour leur position réelle
        lists.forEach(async (list, index) => {
          const newPosition = index + 1; // Index actuel dans le DOM (+1 pour commencer à 1)
          console.log("listId :", list.dataset.listId);
          console.log("Nouvelle position :", newPosition);
    
          // Mettre à jour l'attribut dataset pour garder la cohérence
          list.dataset.position = newPosition;
    
          // Mise à jour en base de données via API
          try {
            await api.updateList(list.dataset.listId, { position: newPosition });
            
          } catch (error) {
            console.error("Erreur lors de la mise à jour de la position :", error);
          }
        });
        toast.success("Liste déplacée!");
      },
    });
  },

  async handleDragAndDropCard() {
    // Sélectionner toutes les listes individuellement
    const lists = document.querySelectorAll(".message-body");

    lists.forEach((list) => {
      new Sortable(list, {
        group: "shared", // Permet de déplacer des cartes entre les listes
        animation: 150, // Animation lors du déplacement
        handle: ".drag-button",       
        onEnd: async (evt) => {
          const cards = document.querySelectorAll("[data-type='card']");
      
          // Récupérer toutes les listes et mettre à jour leur position réelle
          cards.forEach(async (card, index) => {
            const newPosition = index + 1;
            const newListId = card.parentElement.dataset.listId;            
      
            // Mettre à jour l'attribut dataset pour garder la cohérence
            card.dataset.position = newPosition;
            await api.updateCard(card.dataset.cardId, { list_id: newListId, position: newPosition });

          });
          toast.success("Liste déplacée!");
        },
      });
    });
  },
};

export default dragAndDrop;
