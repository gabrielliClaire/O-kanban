const { Card } = require('../models');

const cardController = {
  async getCardsInList(req, res) {
    try {
      
      const listId = req.params.id;
      const cards = await Card.findAll(
        {
          where: {
            list_id: listId
          },
          include: 'tags',
          order: [
            ['position', 'ASC']
          ]
        });

      if (!cards) {
        res.status(404).json('Cant find cards with list_id ' + listId);
      } else {
        res.json(cards);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async getOneCard(req, res) {
    try {
      const cardId = req.params.id;
      const card = await Card.findByPk(cardId, {
        include: 'tags',
        order: [
          ['position', 'ASC']
        ]
      });
      if (!card) {
        res.status(404).json('Cant find card with id ' + cardId);
      } else {
        res.json(card);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  async createCard(req, res) {
    try {
      const { content, color, list_id } = req.body;

      let bodyErrors = [];
      if (!content) {
        bodyErrors.push(`content can not be empty`);
      }
      if (!list_id) {
        bodyErrors.push(`list_id can not be empty`);
      }

      if (bodyErrors.length) {
        res.status(400).json(bodyErrors);
      } else {
        let newCard = Card.build({ content, list_id });
        if (color) {
          newCard.color = color;
        }
        await newCard.save();
        res.json(newCard);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async modifyCard(req, res) {
    try {
      const cardId = req.params.id;
      const { content, color, list_id, position } = req.body;

      // on inclue les tags pour pouvoir les renvoyer à la fin de l'update
      let card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      if (!card) {
        res.status(404).json(`Cant find card with id ${cardId}`);
      } else {
        // on ne change que les paramètres envoyés
        if (content) {
          card.content = content;
        }
        if (list_id) {
          card.list_id = list_id;
        }
        if (color) {
          card.color = color;
        }
        if (position) {
          card.position = position;
        }
        await card.save();
        res.json(card);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async createOrModify(req, res) {
    try {
      let card;
      if (req.params.id) {
        card = await Card.findByPk(req.params.id);
      }
      if (card) {
        await cardController.modifyCard(req, res);
      } else {
        await cardController.createCard(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  async deleteCard(req, res) {
    try {
      const cardId = req.params.id;
      let card = await Card.findByPk(cardId);
      if (!card) {
        res.status(404).json(`Cant find card with id ${cardId}`);
      } else {
        await card.destroy();
        res.json('ok');
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async updateCardsPosition(req, res) {
    // console.log(req.body); // ex: { '4': 2, '5': 3, '1': 1 } // { cardId : position, cardId : position, cardId: position }

    // ✅ Comment on itère sur un objet ? ==> for..in (itère sur les CLES de l'objet)
    // ❌ Comment on itère sur un objet ? ==> for..of (n'existe pas !)

    // console.log("Itération sur les clés. For IN");
    for (const key in req.body) {
      const cardId = key; // '4'
      const position = req.body[key]; // '2'
      
      // On update la position dans la BDD !!
      // === Methode 1 : 2 calls à la BDD ===
      // const card = await Card.findByPk(cardId); // 1 call BDD
      // card.position = position;
      // await card.save(); // 1 call BDD !

      // === Methode 2 : 1 seul call par CARTE ===
      await Card.update({ position: position }, { where: { id: cardId }});

    }

    res.end();
    // req.body = { 1: 4, 2: 1, 3: 6 } // La carte avec l'id 1 met la en position 4 // la carte avec l'ID 2 met la en position 1 // etc...
  }
};


module.exports = cardController;
