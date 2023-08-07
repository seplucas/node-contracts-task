const { Op } = require('sequelize');

const getUnpaid = async (req) => {
const { Job, Contract } = req.app.get('models');
const profileId = req.profile.id;
return await Job.findAll({
    include: [
      {
        model: Contract,
        required: true,
        where: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          status: {
            [Op.eq]: 'in_progress',
          },
        },
      },
    ],
    where: {
      [Op.or]: [
        { paid: null },
      ],
    },
  });
}

const pay = async (req) => {
  const sequelize = req.app.get('sequelize');
  const { Profile, Contract, Job } = req.app.get('models');
  const { jobId } = req.params;
  const { id : userId, balance, type } = req.profile;
  let result = '';

  const job = await Job.findOne({
    where: { id: jobId, paid: { [Op.is]: null } },
    include: [
      {
        model: Contract,
        where: { 
            ClientId: userId,
            status: ['in_progress', 'new']
        },
      },
    ],
  });
  if (job) {
      const price = job.price;

      if(balance < price || type !== 'client'){
      return result;
      }

        const transaction = await sequelize.transaction();
        try {
          await Promise.all([
             Profile.update(
              { balance: sequelize.literal(`balance - ${price}`) },
              { where: { id : userId } },
              { transaction },
            ),

             Profile.update(
              { balance: sequelize.literal(`balance + ${price}`) },
              { where: { id: job.Contract.ContractorId } },
              { transaction },
            ),

             Job.update(
              { paid: 1, paymentDate: new Date() },
              { where: { id: jobId } },
              { transaction },
            ),
          ]);

          await transaction.commit();

          result = `Your payment was successful`;
        } catch (error) {
            console.log(error);
          await transaction.rollback();
          result = `Payment failed`;
        }
    }

  return result;
}


module.exports = {
  getUnpaid,
  pay,
};