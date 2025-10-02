const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

function validationErrorsToResponse(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return { ok: false, payload: errors.array() };
    return { ok: true };
}

async function createUser(req, res, next) {
    try {
    const v = validationErrorsToResponse(req);
    if (!v.ok) return res.status(400).json({ errors: v.payload });
    
    const { name, email } = req.body;

    const created = await userModel.createUser({ name, email });

    return res.status(201).json(created);
    } catch (err) {
        if (err && (err.number === 2627 || err.message && err.message.includes('UNIQUE'))) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next(err); //global error message
    }
}

async function getAll(req, res, next) {
    try {
        const users = await userModel.getAllUsers();
        return res.json(users);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const { id } = req.params;
        const user = await userModel.getUserById(id);

        if (!user) return res.status(404).json({ error: 'User not found' });
        
        return res.json(user);

    } catch (err) {
        next(err);
    }
}

async function updateById(req, res, next) {
    try {
        const v = validationErrorsToResponse(req);
        if (!v.ok) return res.status(400).json({ errors: v.payload });
    
        const { id } = req.params;
        const { name, email } = req.body;
        const updated = await userModel.updateUser(id, { name, email });
        
        if (!updated) return res.status(404).json({ error: 'User not found or nothing to update' });
        return res.json(updated);
    
    } catch (err) {
        if (err && (err.number === 2627 || err.message && err.message.includes('UNIQUE'))) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        next(err);
    }
}


async function deleteById(req, res, next) {
    try {
        const { id } = req.params;
        const deleted = await userModel.deleteUser(id);
        if (!deleted) return res.status(404).json({ error: 'User not found' });

        return res.status(204).end();

    } catch (err) {
        next(err);
    }
}



module.exports = {
    createUser,
    getAll,
    getById,
    updateById,
    deleteById
};