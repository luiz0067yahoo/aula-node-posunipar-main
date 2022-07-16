
const express = require('express');
const router = express.Router();
const controllerPeople = require('../controllers/people-controller');

router.get('/', controllerPeople.verifyJWT, controllerPeople.get_all_peoples);
router.get('/:peopleId', controllerPeople.verifyJWT, controllerPeople.get_by_id_peoples);
router.post('/', controllerPeople.verifyJWT, controllerPeople.create_people);
router.delete('/:peopleId', controllerPeople.verifyJWT, controllerPeople.delete_by_id_peoples);

module.exports = router;