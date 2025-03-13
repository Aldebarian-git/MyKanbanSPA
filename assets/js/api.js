const api = {
  baseUrl: "https://mykanbanapi-production.up.railway.app",

  /**
   * Fonction pour appeler l'API de récupération des listes et les retourner
   */
  async getLists() {
    try {
      const response = await fetch(api.baseUrl + "/lists");

      if (!response.ok) {
        console.error(response);
        return null;
      }

      return await response.json();
    } catch (error) {
      // Le catch se déclenchera si le backend ne répond pas,
      // mais pas si le backend répond avec une erreur HTTP 4xx ou 5xx
      console.error(error);
      return null;
    }
  },

  /**
   * Appelle l'API de création d'une liste : POST /lists
   * @param {Object} data Les données du formulaire à envoyer à l'API POST /lists
   */
  async createList(data) {
    try {
      const response = await fetch(api.baseUrl + "/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Si réponse avec code 4xx ou 5xx => erreur
      if (!response.ok) {
        console.error(response);
        return null;
      }

      // Retourne la liste nouvellement créée
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async updateList(id, data) {
    try {
      const response = await fetch(api.baseUrl + `/lists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(response);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async deleteList(id) {
    try {
      const response = await fetch(api.baseUrl + `/lists/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(response);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async deleteCard(id) {
    try {
      const response = await fetch(api.baseUrl + `/cards/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(response);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async createCard(data) {
    try {
      const response = await fetch(api.baseUrl + "/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(response);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  async updateCard(id, data) {
    try {
      const response = await fetch(api.baseUrl + `/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(id, data);

        console.error(response);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default api;
