const { Tag, Card } = require('../models');

const tagController = {
  async getAllTags(req, res) {
    try {
      const tags = await Tag.findAll();
      res.json(tags);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async createTag(req, res) {
    try {
      const { name, color } = req.body;
      let bodyErrors = []; // pour stocker les erreurs
      if (!name) {
        bodyErrors.push('name can not be empty');
      }
      if (!color) {
        bodyErrors.push('color can not be empty');
      }

      if (bodyErrors.length) {
        res.status(400).json(bodyErrors);
      } else {
        // si on a pas d'erreurs, on crée un tag
        let newTag = Tag.build({ name, color });
        await newTag.save();
        res.json(newTag);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async modifyTag(req, res) {
    try {
      const tagId = req.params.id;
      const { name, color } = req.body;

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json('Can not find tag with id ' + tagId);
      } else {
        // si le tag existe, on regarde les champs présents dans le form, et en fonction on attribue des valeurs au tag qu'on a créé un peu + haut
        if (name) {
          tag.name = name;
        }
        if (color) {
          tag.color = color;
        }
        await tag.save();
        res.json(tag);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async createOrModify(req, res) {
    try {
      let tag;
      if (req.params.id) {
        tag = await Tag.findByPk(req.params.id);
      }
      if (tag) {
        await tagController.modifyTag(req, res);
      } else {
        await tagController.createTag(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  async deleteTag(req, res) {
    try {
      const tagId = req.params.id;

      // est ce que le tag que l'user veut créer existe ? 
      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json('Can not find tag with id ' + tagId);
      } else {
        await tag.destroy();
        res.json('OK');
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  async associateTagToCard(req, res) {
    try {
      console.log(req.body);
      const cardId = req.params.id;
      const tagId = req.body.tag_id;

      let card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      if (!card) {
        return res.status(404).json('Can not find card with id ' + cardId);
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json('Can not find tag with id ' + tagId);
      }

      // on laisse faire la magie de Sequelize !
      await card.addTag(tag);
      // malheureusement, les associations de l'instance ne sont pas mises à jour
      // on doit donc refaire un select
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async removeTagFromCard(req, res) {
    try {
      const { cardId, tagId } = req.params;

      let card = await Card.findByPk(cardId);
      if (!card) {
        return res.status(404).json('Can not find card with id ' + cardId);
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json('Can not find tag with id ' + tagId);
      }

      await card.removeTag(tag);
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  }
};

module.exports = tagController;
