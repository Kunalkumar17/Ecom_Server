const { Router} = require('express')
const router = Router();
const authController = require('../controllers/authController')

router.post('/signup' , authController.signup);
router.post('/login' , authController.login_post);
router.post('/logout' , authController.logout)
router.post('/admin_logout' , authController.admin_logout)
router.post('/admin_login' , authController.login_admin)

module.exports = router;