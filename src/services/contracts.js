const { Op } = require('sequelize');

const getById = async (req) => {
const { Contract } = req.app.get('models');
const { id } = req.params;
const profileId = req.profile.id;
return await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ContractorId: profileId}, { ClientId: profileId }],
    },
  });
}

const getAll = async (req) => {
const { Contract } = req.app.get('models');
const profileId = req.profile.id;
  return await Contract.findAll({
    where: {
      [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      status: {
        [Op.ne]: 'terminated',
      },
    }
    });
  }


module.exports = {
  getById,
  getAll
};