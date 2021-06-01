const express = require('express');
const bodyParser = require('body-parser');

const CcControlsController = require('../controllers/cc-controls');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('', CcControlsController.getCcControls);
router.get('/:id', CcControlsController.getCcControl);

router.post('', checkAuth, CcControlsController.createCcControl);
router.post('/:id', checkAuth, CcControlsController.setInventory);

router.put('/:id', CcControlsController.updateCcControl);

router.delete('/:id', checkAuth, CcControlsController.deleteCcControl);

module.exports = router;

