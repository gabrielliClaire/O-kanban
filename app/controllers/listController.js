const List = require('../models/list');

const listController = {

  async getAllLists(req, res) {
    try {
      // on appelle le modèle List 

      const lists = await List.findAll({
        include: {
          association: 'cards',
          include: 'tags'
        },
        order: [
          ['position', 'ASC'],
          ['cards', 'position', 'ASC']
        ]
      });
      res.json(lists);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  async getOneList(req, res) {
    try {
      // on récupère l'id de la liste passé dans l'url

      const listId = req.params.id;
      const list = await List.findByPk(listId, {
        include: {
          association: 'cards',
          include: 'tags'
        },
        order: [
          ['cards', 'position', 'ASC']
        ]
      });
      if (list) {
        //res.json permet de demander explicitement de renvoyer du json

        res.json(list);
      } else {
        res.status(404).json('Cant find list with id ' + listId);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  async createList(req, res) {
    try {
      const { name, position } = req.body;
      // test présence paramètres
      const bodyErrors = [];
      if (!name) {
        bodyErrors.push('name can not be empty');
      }


      if (bodyErrors.length) {
        // si on a une erreur
        res.status(400).json(bodyErrors);
      } else {
        let newList = List.build({
          name,
          position
        });
        await newList.save();
        res.json(newList);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  async modifyList(req, res) {
    try {
      const listId = req.params.id;
      const list = await List.findByPk(listId);
      if (!list) {
        res.status(404).send('Cant find list with id ' + listId);
        return;
      }

      const { name, position } = req.body; 
      // position                          ===>  "4"
      // parseInt(position)                ===>   4
      // isNaN(parseInt(position))         ===>   false
      // !isNaN(parseInt(position))        ===>   true (donc on fait l'update)


      // position                          ===>  undefined
      // parseInt(position)                ===>  NaN
      // isNaN(parseInt(position))         ===>  true
      // !isNaN(parseInt(position))        ===>  false (donc on laisse la position en l'état)

      if (name) { list.name = name; }
      if (position) { list.position = position; }

      await list.save();

      res.json(list);

    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  async createOrModify(req, res) {
    try {
      let list;
      if (req.params.id) {
        list = await List.findByPk(req.params.id);
      }
      if (list) {
        await listController.modifyList(req, res);
      } else {
        await listController.createList(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  async deleteList(req, res) {
    try {
      const listId = req.params.id;
      const list = await List.findByPk(listId);
      await list.destroy();
      res.end();
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  }
};


module.exports = listController;
