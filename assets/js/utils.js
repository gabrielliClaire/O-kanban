import { toast } from "bulma-toast";

export function closeModals() {
  const modalElements = document.querySelectorAll(".modal");
  modalElements.forEach(modal => {
    modal.classList.remove("is-active"); // - retirerla classe is-active
  });
}

export function listenToClickOnModalClosingElements() {
  const closingElements = document.querySelectorAll(".close, .modal-background"); // Selectionner la croix // Selectionner le bouton Annuler // Selectionner le background
  closingElements.forEach(element => { // Pour chacun de ces élements : 
    element.addEventListener("click", closeModals);
  });
}

export function displayErrorToast(message) {
  toast({
    message: message,
    type: "is-danger",
    dismissible: true,
    position: "top-center",
    animate: { in: "fadeIn", out: "fadeOut" },
  });
}
