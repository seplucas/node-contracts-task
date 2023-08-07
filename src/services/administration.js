const { Op } = require('sequelize');

const getBetterPaidProfessions = async (req) => {
  const { Job, Contract, Profile } = req.app.get('models');
  const { start, end } = req.query;
  const sequelize = req.app.get('sequelize');

  const professions = await Profile.findAll({
    attributes: ['profession', [sequelize.fn('SUM', sequelize.col('price')), 'total']],
    include: [
      {
        model: Contract,
        as: 'Contractor',
        attributes: [],
        required: true,
        include: [
          {
            model: Job,
            required: true,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.gte]: start,
                [Op.lte]: end,
              },
            },
          },
        ],
      },
    ],
    where: {
      type: 'contractor',
    },
    limit: 1,
    group: ['profession'],
    order: [[sequelize.col('total'), 'DESC']],
    subQuery: false,
  });
  return professions[0];
};

const getBetterCustomer = async (req) => {
    const { Job, Contract, Profile } = req.app.get('models');
    const { start, end } = req.query;
    const sequelize = req.app.get('sequelize');
  
    const customers = await Profile.findAll({
      attributes: ['firstName', 'lastName', [sequelize.fn('SUM', sequelize.col('price')), 'totalPaid']],
      include: [
        {
          model: Contract,
          as: 'Contractor',
          attributes: [],
          required: true,
          include: [
            {
              model: Job,
              required: true,
              attributes: [],
              where: {
                paid: true,
                paymentDate: {
                  [Op.gte]: start,
                  [Op.lte]: end,
                },
              },
            },
          ],
        },
      ],
      where: {
        type: 'contractor',
      },
      limit: 2,
      group: ['firstName', 'lastName'],
      order: [[sequelize.col('totalPaid'), 'DESC']],
      subQuery: false,
    });
    return customers;
  };



module.exports = {
    getBetterPaidProfessions,
    getBetterCustomer
};