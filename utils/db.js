import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'users.db');
const db = new Database(dbPath);

// initialize table if it doesnt exist
db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
uuid TEXT,
name TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
createdAt TEXT NOT NULL,
udpatedAt TEXT
);
`);

// prepared statements
const stmtGetAll = db.prepare('SELECT id, uuid, name, email, createdAt, updatedAt FROM users ORDER BY id');
const stmtGetById = db.prepare('SELECT id, uuid, name, email, createdAt, updatedAt FROM users WHERE id = ?');
const stmtGetByUuid = db.prepare('SELECT id, uuid, name, email, createdAt, updatedAt FROM users WHERE uuid = ?');
const stmtInsert = db.prepare('INSERT INTO users(uuid, name, email, createdAt) VALUES (?, ?, ?, ?)');
const stmtUpdate = db.prepare('UPDATE users SET name = ?, email = ?, updatedAt = ? WHERE id = ?');
const stmtDelete = db.prepare('DELETE FROM users WHERE id = ?');

export function getAllUsers(){
    return stmtGetAll.all();
}

export function getUserById(id){
    return stmtGetById.get(id);
}

export function getUserByUuid(uuid){
    return stmtGetByUuid.get(uuid);
}

//returns lastInsertRowId
export function createUser({ uuid, name, email }){
    const createdAt = new Date().toISOString();
    const info = stmtInsert.run(uuid || null, name, email, createdAt);
    return { id: info.lastInsertRowid, uuid, name, email, createdAt };
}

export function updateUserById(id, { name, email }){
    const updatedAt = new Date().toISOString();
    const info = stmtUpdate.run(name, email, updatedAt, id);
    // info.changes === 1 means updated
    if (info.changes === 0) return null;
    return getUserById(id); 
}

export function deleteUserById(id) {
    const user = getUserById(id);
    if (!user) return null;
    stmtDelete.run(id);
    return user;
}