
const express = require('express');
const router = express.Router();
const controllerAddress = require('../controllers/address-controller');

router.get('/', controllerAddress.verifyJWT, controllerAddress.get_all_addresses);
router.get('/:addressId', controllerAddress.verifyJWT, controllerAddress.get_by_id_address);
router.post('/', controllerAddress.verifyJWT, controllerAddress.create_address);
router.delete('/:addressId', controllerAddress.verifyJWT, controllerAddress.delete_by_id_address);

module.exports = router;