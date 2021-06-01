const express = require('express');
const bodyParser = require('body-parser');

const HitController = require('../controllers/hit');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/BCFORBP/:id', checkAuth, HitController.getHitCompany);
router.get('/BESTREG', checkAuth, HitController.getHitInventory);

module.exports = router;

