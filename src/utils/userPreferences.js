/**
 * userPreferences.js
 * This module manages user preferences in the SQLite database.
 * It provides functions to set and get user preferences, such as city and state.
 */

import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

dotenv.config();
const { DB_PATH } = process.env;

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('An error occurred while connecting to the database:', err);
    } else {
        console.log('Connected to the database.');
    }
});

export const setUserPreference = (userId, city, state) => {
    return new Promise((resolve, reject) => {
        // Log the parameters
        console.log(`Setting preferences for user ${userId}: ${city}, ${state}`);

        // Define the SQL query and parameters
        const sql = 'INSERT OR REPLACE INTO preferences (userId, city, state) VALUES (?, ?, ?)';
        const params = [userId, city, state];

        // Log the SQL query and parameters
        console.log('SQL Query:', sql);
        console.log('Parameters:', params);

        // Execute the query
        db.run(sql, params, (err) => {
            if (err) {
                console.error('An error occurred while setting preferences:', err);
                reject(err); // Reject the promise if an error occurs
            } else {
                console.log(`Preferences set for user ${userId}: ${city}, ${state}`);
                resolve(); // Resolve the promise if successful
            }
        });
    });
};
 
export const getUserPreference = (userId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT city, state FROM preferences WHERE userId = ?', [userId], (err, row) => {
            if (err) {
                console.error('An error occurred while getting user preferences:', err);
                reject(err); // Reject the promise if an error occurs
            } else {
                resolve(row); // Resolve the promise with the retrieved row if successful
            }
        });
    });
};
