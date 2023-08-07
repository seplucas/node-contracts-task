const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
const { Op } = require('sequelize');
const ContractsService = require('./services/contracts');
const JobsService = require('./services/jobs');
const ProfilesService = require('./services/profiles');
const AdminService = require('./services/administration');

app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const contract = await ContractsService.getById(req);
    if(!contract) return res.status(404).end()
    res.json(contract)
})

app.get('/contracts',getProfile ,async (req, res) =>{
    const contracts= await ContractsService.getAll(req);
    if(!contracts) return res.status(404).end()
    res.json(contracts)
})

app.get('/jobs/unpaid',getProfile ,async (req, res) =>{
  const jobs = await JobsService.getUnpaid(req);
  if(!jobs) return res.status(404).end()
  res.json(jobs)
})

app.get('/admin/best-profession',getProfile ,async (req, res) =>{
  const profession = await AdminService.getBetterPaidProfessions(req);
  if(!profession) return res.status(404).end()
  res.json(profession)
});

app.get('/admin/best-clients',getProfile ,async (req, res) =>{
  const customers = await AdminService.getBetterCustomer(req);
  if(!customers) return res.status(404).end()
  res.json(customers)
});

app.post('/jobs/:jobId/pay',getProfile ,async (req, res) =>{
  const jobs = await JobsService.pay(req);
  if(!jobs) return res.status(404).end()
  res.json(jobs)
})

app.post('/balances/deposit/:userId',getProfile ,async (req, res) =>{
  const profile = await ProfilesService.insertDeposit(req);
  if(!profile) return res.status(404).end()
  res.json(profile)
})


app.get
module.exports = app;
