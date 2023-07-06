import { listenToSubmitOnAddCardForm, listenToSubmitOnDeleteCardForm } from "./cards.module.js";
import {
  listenToClickOnAddListButton,
  listenToSubmitOnAddListForm,
  fetchAndDisplayListsAndCards,
  listenToSubmitOnEditListForm,
  listenToDragAndDropOnLists
} from "./lists.module.js";
import { listenToClickOnModalClosingElements } from "./utils.js";

listenToClickOnAddListButton();
listenToClickOnModalClosingElements();
listenToSubmitOnAddListForm();
listenToSubmitOnEditListForm();
listenToSubmitOnAddCardForm();
listenToSubmitOnDeleteCardForm();
fetchAndDisplayListsAndCards();
listenToDragAndDropOnLists();


