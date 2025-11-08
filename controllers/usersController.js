import { v4 as uuidv4 } from 'uuid';
import {readAll, writeAll } from '../utils/fileDb.js';

export async function listUsers(req, res){
    const users = await readAll();
    res.json(users);
}

export async function getUser(req, res){
    const users = await readAll();
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
}

function validateUserPayload(body){
    if (!body || typeof body !== 'object') return 'Invalid body';
    if (!body.name || typeof body.name !== 'string') return 'name is required (string)';
    if (!body.email || typeof body.email !== 'string') return 'email is required (string)';
    return null;
}

export async function createUser(req, res){
    const err = validateUserPayload(req.body);
    if (err) return res.status(400).json({ error: err });

    const users = await readAll();
    const newUser = {
        id: uuidv4(),
        name: req.body.name,
        email: req.body.email,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await writeAll(users);
    res.status(200).json(newUser);
}

export async function updateUser(req, res){
    const users = await readAll();
    const idx = users.findIndex(u => u.id === req.params.id);
    if ( idx === -1 ) return res.status(404).json({ error: 'User not found' });

    // Accept partial update
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeAll(users);
    res.json(users[idx]);
}

export async function deleteUser(req, res){
    const users = await readAll();
    const idx = users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    const removed = users.splice(idx, 1)[0];
    await writeAll(users);
    res.json({ deleted: true, user: removed });
}