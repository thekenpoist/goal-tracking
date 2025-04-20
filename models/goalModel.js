const fsPromises = require('fs').promises;
const path = require('path');
const { error } = require('console');

const p = path.join(__dirname, '..', 'data', 'goals.json');

const getGoalsFromFile = async () => {
    try {
        const fileContent = await fsPromises.readFile(p, 'utf-8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.warn('Error reading goals.json. Returning empty array.');
        return [];
    }
};