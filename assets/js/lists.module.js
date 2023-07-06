import Sortable from "sortablejs";

import { createList, getList, updateCard, updateCardsPosition, updateList } from "./api.js";
import { insertCardInList } from "./cards.module.js";
import { closeModals, displayErrorToast } from "./utils.js";

export function listenToClickOnAddListButton() {
  const addListButton = document.getElementById("add-list-button"); // Selectionner le bouton + (celui de Ajouter une liste)
  addListButton.addEventListener("click", () => { // Ecouter le click dessus, en cas de click (callback) : 
    const addListModal = document.getElementById("add-list-modal"); // - Selectionner la modale à ouvrir
    addListModal.classList.add("is-active"); // - Lui ajouter la classe is-active
  });
}

export function listenToSubmitOnAddListForm() {
  const addListForm = document.querySelector("#add-list-modal form"); // Selectionner le form dans la modal
  addListForm.addEventListener("submit", async (event) => { // On écoute le "submit" sur ce form
    // Récupération des données du formulaire
    event.preventDefault(); // - empêcher le comportement par défaut d'un submit (le call HTTP sous jacent qui a pour conséquence de recharger la page)
    const formData = new FormData(event.target); // - récupérer les données du formulaire
    const newListData = Object.fromEntries(formData); // Astuce ! ex : { name: "Liste des courses" }

    // Appel au backend pour créer la liste de manière effective
    const createdList = await createList(newListData); // createdList = { id: 42, name: "..." } || null

    if (!createdList) {
      displayErrorToast("Une erreur s'est produite lors de la création de la création de la liste. Veuillez réessayer plus tard.");
    } else {
      addListToListContainer(createdList);
    }

    closeModals();
    addListForm.reset();
  });
}

export function addListToListContainer(listData) { // EX : list = { name: "Liste des courses", id: 42 }
  const listTemplate = document.getElementById("list-template"); // Selectionner le template
  const listClone = listTemplate.content.cloneNode(true); // Le cloner

  listClone.querySelector('[slot="list-name"]').textContent = listData.name; // - selectionner le slot pour le nom de la liste et y ajouter listData.name
  listClone.querySelector('[slot="list-id"]').setAttribute("id", `list-${listData.id}`); // - selectionner le slot pour l'ID de la liste et y ajouter listData.id

  // === On écoute le click sur le bouton "+" pour ajouter une carte dans la liste ===
  const addCardButton = listClone.querySelector('[slot="add-card-button"]'); // Selectionner le bouton d'ajout d'une carte
  addCardButton.addEventListener("click", () => { // Ecouter le click sur le button
    const addCardModal = document.getElementById("add-card-modal"); // Selectionner la modal
    addCardModal.classList.add("is-active"); // Ajouter la classe is-active dessus

    const listId = listData.id; // Récupérer l'ID de la liste cliquée
    addCardModal.dataset.listId = listId; // On balance cet ID dans la modale de création de carte 
  });

  // === On écoute le click sur le bouton "le titre de la liste" pour modifier le nom de cette liste ===
  const listTitle = listClone.querySelector('[slot="list-name"]');
  listTitle.addEventListener("click", () => {
    const editListModal = document.getElementById("edit-list-modal");
    editListModal.classList.add("is-active");

    // Passer à la modale le nom actuel de la liste // Selectionner l'input de la modale et changer sa value
    const currentListName = document.getElementById(`list-${listData.id}`).querySelector('[slot="list-name"]').textContent;
    editListModal.querySelector('input[name="name"]').value = currentListName;
    editListModal.dataset.listId = listData.id;
  });

  const cardsContainer = listClone.querySelector('[slot="list-content"]');
  Sortable.create(cardsContainer, {
    animation: 150,
    group: "shared",
    onEnd: async (event) => {
      console.log(event);

      // 1er temps : on modifie la liste de la carte
      const cardId = event.item.id.substring(5); // 5
      const listId = event.to.parentElement.id.substring(5);
      const updatedCard = await updateCard(cardId, { list_id: listId });
      if (!updatedCard) {
        displayErrorToast("Une erreur s'est produite lors du déplacement de la carte. Veuillez réessayer plus tard.");
      }

      // 2eme temps : on s'assure des positions des cartes au sein de la liste son respecté
      // Je dois construire ça : { 1: 4, 2: 1, 3: 6 } // La carte avec l'ID est est position 4, ....

      const cardsContainer = event.to;
      const cards = Array.from(cardsContainer.children); // [ { id: "card-3" }, { id: "card-5" }, { id: "card-1" } ]
      // On aurait pu faire un query selector : document.querySelectorAll(`#list-${event.to.???} article.card`)

      const body = {}; // Objectif : construire ça : { 1: 4, 2: 1, 3: 6 }

      cards.forEach((card, index) => {
        const cardId = card.id.substring(5);
        const cardPosition = index + 1; // On met +1 pour éviter d'avoir une carte à la position : 0 car le backend n'aime pas ==> TECHNIQUEMENT, il faudrait plutôt réparer le backend !
        body[cardId] = cardPosition; // ~ { cardId : cardPosition }
      });

      const isUpdated = await updateCardsPosition(body);
      if (!isUpdated) {
        displayErrorToast("Une erreur s'est produite lors du déplacement de la carte. Veuillez réessayer plus tard.");
      }
    }
  });

  const listsContainer = document.getElementById("lists-container"); // Selectionner le parent dans lequel on va insérer le clone
  listsContainer.appendChild(listClone); // Insérer le clone dans le parent !
}

export async function fetchAndDisplayListsAndCards() {
  const lists = await getList();
  if (!lists) { // Pbl backend
    displayErrorToast("Une erreur s'est produite. Veuillez revenir plus tard");
    return;
  }
  
  lists.forEach(list => {
    addListToListContainer(list); // Les afficher dans le DOM

    list.cards.forEach(card => { // Pour chaque carte dans list.cards
      insertCardInList(card); // on insère cette carte dans le DOM
    });
  });
}

export function listenToSubmitOnEditListForm() {
  // Selectionner la modale edit list
  // Selectionner le FORM qui est dedans
  // Ecouter le submit sur ce form
  // Récupérer les data du form
  // Récupérer l'ID de la liste à modifier qui est présente dans les dataset de la modale
  // Faire un call HTTP vers la route :
  // - méthode : PATCH
  // - url : lists/42
  // - body : { name: "..." }
  // Récupérer la réponse HTTP, le body, pour confirmer que la liste a bien été modifié.
  
  // On update la liste dans le DOM pour que l'utilisateur constate la bonne modification
  // Selectionner la liste => selectionner son titre à l'intérieur
  // Modifier le textContent de ce titre avec la nouvelle valeur

  // On close la modal et reset le form

  const editListModal = document.getElementById("edit-list-modal");
  const editListForm = editListModal.querySelector("form");

  editListForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newListData = Object.fromEntries(formData); // { name: "..." }

    const listId = editListModal.dataset.listId; // 42

    const updatedList = await updateList(listId, newListData);

    if (!updatedList) {
      displayErrorToast("Une erreur s'est produite lors de la création de la modification de la liste. Veuillez réessayer plus tard.");
    } else {
      const list = document.getElementById(`list-${listId}`);
      const listTitle = list.querySelector('[slot="list-name"]');
      listTitle.textContent = updatedList.name;
    }

    closeModals();
    editListForm.reset();
  });
}


export function listenToDragAndDropOnLists() {
  // Selectionner le conteneur des listes 
  // Puis appeller `Sortable.create()` dessus.

  const listsContainer = document.getElementById("lists-container");
  Sortable.create(listsContainer, {
    animation: 150,
    onEnd: async (/* event */) => {
    // ===== Notre solution n°1 : pas parfait car on fini avec des listes qui ont la même position ====
    
      // const listId = event.item.id.substring(5); // list-4 => 4
      // const position = event.newIndex; // 0

      // const updatedList = await updateList(listId, { position });

      // if (! updatedList) { // L'update n'a pas marché
      //   displayErrorToast("Une erreur est survenue lors du déplacement des listes. Veuillez réessayer plus tard");
      // }
      // Update le DOM ??? => Non pas besoin, on a déjà fait la partie frontend du drag and drop 


      // ===== Notre solution n°2 : on update la position de CHAQUE liste ====
      // Selectionner chaque liste
      // Pour chaque liste, on regarde sa position
      // Et on update cette liste via un call HTTP

      const lists = document.querySelectorAll(".list"); // [ {}, {}, {} ]
      lists.forEach(async (list, index) => { // list = { id: "list-3"} comme élément 0 du tableau 
        const listId = list.id.substring(5); // list-3 => 3
        const position = index + 1; // index = 0 pour le premier élément du tableau, on met la position 1 en BDD
      
        await updateList(listId, { position });
      });
    }
  });

}
