const express = require('express');
const bodyParser = require('body-parser');

const CompanyController = require('../controllers/companies');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('', CompanyController.getCompanies);
router.get('/:bnr', CompanyController.getCompany);
router.get('/getById/:bnrId', CompanyController.getCompanyById);

router.post('', checkAuth, CompanyController.createCompany);

router.put('/:id', checkAuth, CompanyController.updateCompany);

router.delete('/:bnr', checkAuth, CompanyController.deleteCompany);

module.exports = router;

