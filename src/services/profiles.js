const { Op } = require('sequelize');

const insertDeposit = async (req) => {
    let result = ''
    const clientId = req.params.userId;
    const { amount } = req.body;
    const { Job, Contract, Profile } = req.app.get('models');

    const sequelize = req.app.get('sequelize');
    try {
      const client = await Profile.findByPk(clientId);
      const pendingToPay = await Job.findAll(
        {
          attributes: {
            include: [[sequelize.fn('SUM', sequelize.col('price')), 'totalPrice']],
          },
          include: [
            {
              attributes: [],
              model: Contract,
              required: true,
              where: {
                ClientId: clientId,
                status: 'in_progress',
              },
            },
          ],
          where: {
            paid: null,
          },
        },
      );
  
      const { totalPrice } = pendingToPay[0].dataValues;
      if (totalPrice == null) {
        return result;
      }
  
      const limit = totalPrice * 0.25;
      if (amount > limit) {
        result = `Deposit failed. You can deposit max ${limit}`;
  
      } else {
        await client.update({ balance: sequelize.literal(`balance + ${amount}`)  });
        client.save();
        result = `Deposit of ${amount} was successful`;
      }
      
      return result;
  
    } catch (error) {
        return error.message;
    }
}



module.exports = {
  insertDeposit,
};