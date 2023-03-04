const express = require('express');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/authController');

const router = express.Router();

router.route('/getAllTask').get(userController.protect,taskController.getAllTask)
router.route('/createTask').post(userController.protect,taskController.createTask);
router.route('/updateTask/:id').patch(userController.protect,taskController.updateTask)
router.route('/deleteTask/:id').delete(userController.protect,taskController.deleteTask);
router.route('/reArrangeTask').put(userController.protect,taskController.reArrangedTask);

module.exports = router;