require("dotenv/config");

const { List } = require('../app/models');

runTest();


async function runTest() {
  try {

    const lists = await List.findAll({
      include: [
        {
          association: 'cards',
          include: [{
            association: 'tags'
          }]
        }
      ],
      order: [
        ['cards', 'position', 'ASC']
      ],
    });

    lists.forEach( (list) => {
      let str = `La liste "${list.name}" contient les cartes : \n`;
      list.cards.forEach( (card) => {
        str += `\t- "${card.content}" avec les tags : ${card.tags.map(tag=>`"${tag.name}"`).join(',')}\n`;
      });
      console.log(str);
    });

  } catch (error) {
    console.trace(error);
  }

}
