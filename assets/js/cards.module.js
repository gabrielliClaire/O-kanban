import { createCard, deleteCard } from "./api.js";
import { closeModals, displayErrorToast } from "./utils.js";

export function listenToSubmitOnAddCardForm() {
  const addCardModal = document.getElementById("add-card-modal"); // Selectionner la carte
  const addCardForm = addCardModal.querySelector("form"); // Selectionner le FORM dans la modal carte
  addCardForm.addEventListener("submit", async (event) => { // Ecouter le submit dessus
    event.preventDefault();
    const formData = new FormData(event.target);
    const newCardData = Object.fromEntries(formData); // - Récupérer les données, en un objet JS
    
    const listId = addCardModal.dataset.listId; // Je récupère l'ID directement sur la modale
    newCardData.list_id = listId; // je l'ajoute aux data à envoyer au backend
    
    // CALL BACKEND
    const createdCard = await createCard(newCardData);

    if (!createdCard) {
      displayErrorToast("Une erreur s'est produite lors de la création de la création de la carte. Veuillez réessayer plus tard.");
    } else {
      insertCardInList(createdCard);
    }
  
    closeModals();
    addCardForm.reset();
  });
}

export function insertCardInList(cardData) { // Ex: cardData = { content: "Lait", id: 54, list_id: 42 }
  const cardTemplate = document.getElementById("card-template");
  const cardClone = cardTemplate.content.cloneNode(true);

  cardClone.querySelector('[slot="card-id"]').setAttribute("id", `card-${cardData.id}`);
  cardClone.querySelector('[slot="card-content"]').textContent = cardData.content;
  cardClone.querySelector('[slot="card-id"]').style.backgroundColor = cardData.color;

  cardClone.querySelector('[slot="card-delete-button"]').addEventListener("click", () => {
    document.getElementById("delete-card-modal").classList.add("is-active");
    document.getElementById("delete-card-modal").dataset.cardId = cardData.id;
  });

  const list = document.querySelector(`#list-${cardData.list_id} [slot="list-content"]`);
  list.appendChild(cardClone);
}


export function listenToSubmitOnDeleteCardForm() {
  // Ecouter le submit 
  // récupérer l'ID de la liste
  // Faire le call HTTP 
  // Aller manger

  const deleteCardModal = document.getElementById("delete-card-modal");
  const deleteCardForm = deleteCardModal.querySelector("form");

  deleteCardForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cardId = deleteCardModal.dataset.cardId;

    const isCardDeleted = await deleteCard(cardId);

    if (isCardDeleted) {
      const card = document.getElementById(`card-${cardId}`);
      card.remove(); // Retire complètement l'élément du DOM
    } else {
      displayErrorToast("Une erreur est survenue lors de la suppression de la carte. Veuillez réessayer plus tard.");
    }

    closeModals();
  });
}
