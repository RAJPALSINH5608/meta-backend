const express = require('express')
const router = express.Router()

const AccountController = require("../controllers/auth");
const auth = require("../middleware/auth")

// Account related routes :->
router.post('/:admin/adminUpdate',auth,AccountController.adminUpdate);
router.post('/brokerregister',AccountController.brokerregistration);
router.post('/userregister',AccountController.userregistration);
router.get('/:user/refer',AccountController.referlink );
router.post('/userlogin' , AccountController.userLogin);
router.post('/adminlogin' , AccountController.adminLogin);
router.post('/brokerlogin' , AccountController.brokerLogin);
router.post('/userResetPassword',AccountController.userResetPwd)
router.post('/brokerResetPassword',AccountController.brokerResetPwd)
router.get('/logout' ,auth, AccountController.logout)
router.post('/resetUserPassword/:tokenId' , AccountController.userResetPassword)
router.post('/resetBrokerPassword/:tokenId' , AccountController.brokerResetPassword)
router.post('/updatepassword', AccountController.updatepassword)
router.get('/getallusername', AccountController.getUsers)
router.get('/resetUserPassword/:tokenId' , (req,res)=> {
 res.send("Welcome to reset password")
});
// router.get('/resetBrokerPassword/:tokenId' ,(req,res)=>{
//     res.send("Welcome to reset password")
// });

module.exports = router;