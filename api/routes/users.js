
const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/user-controller');


router.get('/', controllerUser.verifyJWT, controllerUser.get_all_users);

router.get('/info', controllerUser.verifyJWT,controllerUser.get_info_users);
router.post('/signup', controllerUser.signup_user);

router.post('/login', controllerUser.login_user);

router.delete('/:userId', controllerUser.verifyJWT, controllerUser.get_by_id_users);
  
  
  module.exports = router;