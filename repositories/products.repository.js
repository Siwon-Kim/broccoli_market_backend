const { Op } = require('sequelize');
// const { post } = require('superagent');

class ProductsRepository {
  constructor(model, usersInfoModel) {
    this.model = model;
    this.usersInfoModel = usersInfoModel;
  }

  createProduct = async (user_id, id, title, content, price, category, photo_ip) => {
    await this.model.create({
        user_id,
        user_info_id: user_id,
        id,
        title,
        content,
        price,
        category,
        photo_ip
    });
  };

  findAllProducts = async () => {
    return await this.model.findAll({
      include: [
        {
          model: this.usersInfoModel,
          attributes: ['address'],
        },
      ],
    });
  };

  getOneProduct = async (product_id) => {
    return await this.model.findOne({
      where: { product_id },
      include: [
        {
          model: this.usersInfoModel,
          attributes: ['address'],
        },
      ],
    });
  };

  hitsProduct = async (product_id) => {
    await this.model.increment(
      { views: +1 },
      { where: {product_id} }
    )
  }

  updateProduct = async (product_id, title, content, price, category, photo_ip) => {
    return await this.model.update(
      { title, content, price, category, photo_ip },
      { where: { product_id } }
    );
  };

  deleteProduct = async (product_id) => {
    return await this.model.destroy(
      { where: { product_id } }
    );
  };

  // searchProduct = async (keywords) => {
  //   const results = [];

  //   for (const keyword of keywords) {
  //     const query = {
  //       where: {
  //         text: {
  //           contains: keyword,
  //         },
  //       },
  //     };
  //     results.push(await this.model.findAll(query));
  //   } 
  //   return results;
  // }
}

module.exports = ProductsRepository;
