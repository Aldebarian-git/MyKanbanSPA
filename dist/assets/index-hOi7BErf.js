(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function r(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(o){if(o.ep)return;o.ep=!0;const l=r(o);fetch(o.href,l)}})();const n={baseUrl:"http://localhost:3000",async getLists(){try{const e=await fetch(n.baseUrl+"/lists");return e.ok?await e.json():(console.error(e),null)}catch(e){return console.error(e),null}},async createList(e){try{const t=await fetch(n.baseUrl+"/lists",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return t.ok?await t.json():(console.error(t),null)}catch(t){return console.error(t),null}},async updateList(e,t){try{const r=await fetch(n.baseUrl+`/lists/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});return r.ok?await r.json():(console.error(r),null)}catch(r){return console.error(r),null}},async deleteList(e){try{const t=await fetch(n.baseUrl+`/lists/${e}`,{method:"DELETE"});if(!t.ok)return console.error(t),null}catch(t){return console.error(t),null}},async deleteCard(e){try{const t=await fetch(n.baseUrl+`/cards/${e}`,{method:"DELETE"});if(!t.ok)return console.error(t),null}catch(t){return console.error(t),null}},async createCard(e){try{const t=await fetch(n.baseUrl+"/cards",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return t.ok?await t.json():(console.error(t),null)}catch(t){return console.error(t),null}}},a={init(){document.querySelectorAll(".close").forEach(e=>{e.addEventListener("click",()=>a.close())})},open(e){document.querySelector(e).showModal()},close(e="dialog[open]"){document.querySelector(e).close()}},i={init(){this.bind()},bind(){document.querySelector("#add-card-modal form").addEventListener("submit",this.handleAddCard.bind(this))},async handleAddCard(e){e.preventDefault();const t=e.currentTarget,r=Object.fromEntries(new FormData(t)),s=document.querySelector("#add-card-modal").dataset.listId;if(r.list_id=s,!r.content||r.content===""){alert("Veuillez saisir un contenu pour la carte !");return}if(!s){alert("Impossible de créer la carte !");return}const o=await n.createCard(r);if(o===null){alert("Impossible de créer la carte !");return}this.addCardToListOnDOM(o),t.reset(),a.close()},async handleDeleteCard(e){if(await n.deleteCard(e)===null){alert("Impossible de supprimer la carte !");return}const r=document.querySelector(`[data-card-id="${e}"]`);r&&r.remove()},addCardToListOnDOM(e){const t=document.querySelector(`[data-list-id="${e.list_id}"]`),s=document.getElementById("card-template").content.cloneNode(!0);s.querySelector(".card-header-title").textContent=e.content,s.querySelector(".card").dataset.cardId=e.id,s.querySelector(".delete-card-button").addEventListener("click",()=>{this.handleDeleteCard(e.id)}),t.querySelector(".message-body").append(s)}},c={init(){this.bind(),this.loadLists()},bind(){document.getElementById("add-list-button").addEventListener("click",()=>a.open("#add-list-modal")),document.querySelector("#add-list-modal form").addEventListener("submit",this.handleAddList.bind(this)),document.querySelector("#edit-list-modal form").addEventListener("submit",this.handleEditList.bind(this)),document.querySelector("#delete-list-modal form").addEventListener("submit",this.handleDeleteList.bind(this)),document.querySelector("#add-card-modal form").addEventListener("submit",i.handleAddCard)},async loadLists(){const e=await n.getLists();if(e===null){alert("Impossible de charger les listes !");return}e.forEach(t=>this.addListToDOM(t))},async handleAddList(e){e.preventDefault();const t=e.currentTarget,r=Object.fromEntries(new FormData(t));r.position||(r.position=document.querySelectorAll('[data-type="list"]').length+1);const s=await n.createList(r);if(s===null){alert("Impossible de créer la liste !");return}this.addListToDOM(s),a.close(),t.reset()},async handleEditList(e){e.preventDefault();const t=e.currentTarget,r=Object.fromEntries(new FormData(t)),s=document.querySelector("#edit-list-modal").dataset.listId,o=await n.updateList(s,r);if(o===null){alert("Impossible de modifier la liste !");return}const l=document.querySelector(`[data-list-id="${s}"]`);l.querySelector('[slot="list-title"]').textContent=o.title,a.close(),t.reset()},async handleDeleteList(e){if(e.preventDefault(),e.currentTarget){const r=document.querySelector("#delete-list-modal").dataset.listId;try{if(await n.deleteList(r)===null)throw new Error("Échec de la suppression de la liste.");const o=document.querySelector(`[data-list-id="${r}"]`);o&&o.remove(),a.close()}catch(s){console.error("Erreur lors de la suppression de la liste :",s),alert("Impossible de supprimer la liste. Veuillez réessayer.")}}},async handleDragAndDrop(){const e=document.querySelector("#lists-container");if(!e){console.error("Erreur : Le conteneur des listes (#lists-container) est introuvable !");return}new Sortable(e,{animation:150,ghostClass:"sortable-ghost",swapThreshold:.5,onEnd:async t=>{const r=t.item,s=t.from.children[t.oldIndex];await n.updateList(r.dataset.listId,{position:t.newIndex+1}),await n.updateList(s.dataset.listId,{position:t.oldIndex+1})}})},addListToDOM(e){const r=document.getElementById("list-template").content.cloneNode(!0);r.querySelector('[slot="list-title"]').textContent=e.title,r.querySelector("section.message.is-info").dataset.listId=e.id,r.querySelector(".edit-list-button").addEventListener("click",()=>{document.querySelector("#edit-list-modal").dataset.listId=e.id,a.open("#edit-list-modal")}),r.querySelector(".delete-list-button").addEventListener("click",()=>{a.open("#delete-list-modal"),document.querySelector("#delete-list-modal").dataset.listId=e.id}),r.querySelector(".add-card-button").addEventListener("click",()=>{document.querySelector("#add-card-modal").dataset.listId=e.id,a.open("#add-card-modal")}),document.getElementById("lists-container").append(r),e.cards&&e.cards.forEach(s=>{i.addCardToListOnDOM(s)}),this.handleDragAndDrop()},async handleDeleteCard(e){if(await n.deleteCard(e)===null){alert("Impossible de supprimer la carte !");return}const r=document.querySelector(`[data-card-id="${e}"]`);r&&r.remove()}},u={init(){a.init(),c.init(),i.init()}};document.addEventListener("DOMContentLoaded",u.init);
