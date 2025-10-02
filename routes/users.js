const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post(
    '/',[
        body('name').exists().withMessage('name is required').bail().isLength({ min: 3 }),
        body('email').exists().withMessage('email is required').bail().isEmail().withMessage('invalid email')
    ],
    usersController.createUser
);

router.get('/', usersController.getAll);

router.get(
    '/:id', [param('id').isInt().withMessage('id must be an integer')], usersController.getById
);

router.put(
    '/:id',
    [
        param('id').isInt().withMessage('id must be an integer'),
        body('name').optional().isLength({ min: 1 }),
        body('email').optional().isEmail().withMessage('invalid email')
    ],
    usersController.updateById
);

router.delete(
    '/:id', [param('id').isInt().withMessage('id must be an integer')], usersController.deleteById
);
    
module.exports = router;