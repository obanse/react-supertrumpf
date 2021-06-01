const express = require('express');
const bodyParser = require('body-parser');

const CattlesController = require('../controllers/cattles');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('', CattlesController.getCattles);
router.get('/:lom', checkAuth, CattlesController.getCattle);
router.get('/get/:cccId', checkAuth, CattlesController.getCattlesByCccId);

router.post('', checkAuth, CattlesController.saveCattles);

router.delete('/:cccId', checkAuth, CattlesController.removeCattlesByCccId);

// router.post('', checkAuth, CattlesController.createCattle);
// router.put('', checkAuth, CattlesController.saveCattles);

module.exports = router;
