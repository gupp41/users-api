import fs from 'fs/promises';
import path from 'path';

const dbFile = path.resolve('data', 'users.json');

export async function readAll() {
    try{
        const txt = await fs.readFile(dbFile, 'utf8');
        return JSON.parse(txt || '[]');
    } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

export async function writeAll(data) {
    await fs.mkdir(path.dirname(dbFile), { recursive: true });
    await fs.writeFile(dbFile, JSON.stringify(data, null, 2), 'utf8');
}