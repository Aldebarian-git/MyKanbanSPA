
import modal from "./modal.js";
import list from "./list.js";
import card from "./card.js";
import toast from "./toast.js";

import themeToogle from "./themeToogle.js";


const app = {
  /**
   * On y fait tout ce qui doit être fait au chargement de la page
   */
  init() {    
    toast.init();
    modal.init();
    list.init();
    card.init();    
    themeToogle();
  },

};

document.addEventListener("DOMContentLoaded", app.init);
