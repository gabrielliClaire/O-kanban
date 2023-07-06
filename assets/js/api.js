import { apiBaseUrl } from "./config.js"; // Attention à bien préciser l'extension pour les import côté front

export async function createList(listData) { // ex : { name: "..." }
  const url = `${apiBaseUrl}/lists`;
  let httpResponse;
  try {
    httpResponse = await fetch(url, { // Appel HTTP POST vers le backend pour créer une liste
      method: "POST",
      body: JSON.stringify(listData),
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.log(error);
    return null;
  }
  
  // On peut vérifier, avant d'extraire le body, si la réponse HTTP est OK !
  // Si c'est pas OK => returner null, puis, dans la fonction principale, afficher une erreur !
  // Si c'est OK ! => extraire le body et retourner le JSON.
  if (!httpResponse.ok) { // true si 2XX / 3XX   || false si 4XX / 500   // (Clause de garde, pas besoin de else puisque ça s'arrête si on passe dedans) => évite les indentations en pagaille
    console.log(httpResponse.status);
    return null;
  }
  
  const createdList = await httpResponse.json(); // { id: 42, name: "..." } // Et récupérer les données de la liste créée en sortie
  return createdList;
}


export async function createCard(cardData) { // ex: cardData = { content: "...", list_id: 42 }
  try {
    const url = `${apiBaseUrl}/cards`;
    const httpResponse = await fetch(url, {
      method: "POST",
      body: JSON.stringify(cardData),
      headers: { "Content-Type": "application/json" }
    });
  
    if (!httpResponse.ok) { // Si on a fait une erreur dans le code client et qu'on a permis à l'utilisateur de créer une carte sans content. Ou que le backend n'a pas réussi à contacter la BDD donc nous a renvoyé une 500 !
      console.log(httpResponse.status);
      return null;
    }
  
    const createdCard = await httpResponse.json();
    return createdCard;
  
  } catch (error) { // Si le call HTTP via fetch plante complet ! Notre réseau saute / le backend est en maintenance !
    console.log(error);
    return null;
  }
}


export async function getList() {
  try {
    const url = `${apiBaseUrl}/lists`;
    const httpResponse = await fetch(url);
    const lists = await httpResponse.json(); // Recupérer les listes depuis le backend (call HTTP => fetch)
    return lists;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateList(listId, newListData) {
  try {
    const url = `${apiBaseUrl}/lists/${listId}`;
    const httpResponse = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(newListData),
      headers: { "Content-Type": "application/json" }
    });
  
    if (!httpResponse.ok) { return null; }
  
    const updatedList = await httpResponse.json();
    return updatedList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteCard(cardId) {
  try {
    const url = `${apiBaseUrl}/cards/${cardId}`;
    const httpResponse = await fetch(url, {
      method: "DELETE",
    });
  
    if(!httpResponse) { return false; }
  
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function updateCard(cardId, newCardData) { // ex: newCardData = { list_id: X }
  try {
    const url = `${apiBaseUrl}/cards/${cardId}`;
    const httpResponse = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(newCardData),
      headers: { "Content-Type": "application/json" }
    });
  
    if(!httpResponse.ok) { return null; }
  
    const updatedCard = await httpResponse.json();
    return updatedCard;
  
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateCardsPosition(body) {
  // body = { 1: 4, 2: 1, 3: 6 }
  try {
    const url = `${apiBaseUrl}/positions/cards`;
    const httpResponse = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
  
    if (!httpResponse.ok) { return false; } // Quelque chose s'est produit côté backend, peut-être une 400 si notre body n'est pas bon.
  
    return true; // Tout s'est bien passé du côté de l'update !
  
  } catch (error) {
    console.error(error);
    return false;
  }
}
