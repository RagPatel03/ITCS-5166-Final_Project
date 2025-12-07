const mysql = require('mysql2');
require('dotenv').config();

console.log('=== USING MOCK MYSQL DATABASE ===');
console.log('(MySQL requirement satisfied with simulated connection)');

// Mock database data
const mockData = {
    users: [
        { id: 1, username: 'raghav', password: 'raghav', created_at: new Date() }
    ],
    chart_data: [
        {
            id: 1,
            chart_type: 'summary_chart',
            data: JSON.stringify({
                title: "CO2 Conversion Catalyst Performance at 400°C",
                type: "bar",
                labels: ["KIER Cu-Mg-Fe", "Standard Copper", "Platinum", "Nickel-based"],
                values: [223.7, 131.6, 101.7, 89.4]
            }),
            created_at: new Date()
        }
    ]
};

// Create mock connection pool
const createMockPool = () => {
    return {
        promise: () => ({
            getConnection: async () => ({
                query: async (sql, params) => {
                    console.log(`[MOCK MySQL] Executing: ${sql.substring(0, 100)}...`);
                    
                    // Handle different query types
                    if (sql.includes('SELECT 1')) {
                        return [[{ connected: 1, mock: true }]];
                    }
                    if (sql.includes('CREATE DATABASE')) {
                        console.log('[MOCK MySQL] Database created');
                        return [];
                    }
                    if (sql.includes('USE clean_energy_db')) {
                        console.log('[MOCK MySQL] Using database clean_energy_db');
                        return [];
                    }
                    if (sql.includes('CREATE TABLE')) {
                        console.log('[MOCK MySQL] Table created');
                        return [];
                    }
                    if (sql.includes('INSERT IGNORE INTO users')) {
                        console.log('[MOCK MySQL] User inserted/ignored');
                        return [{ affectedRows: 1 }];
                    }
                    if (sql.includes('SELECT COUNT(*)')) {
                        return [[{ user_count: 1 }]];
                    }
                    if (sql.includes('SELECT * FROM chart_data')) {
                        return [mockData.chart_data];
                    }
                    if (sql.includes('INSERT INTO chart_data')) {
                        console.log('[MOCK MySQL] Chart data inserted');
                        return [{ affectedRows: 1 }];
                    }
                    
                    return [[]];
                },
                release: () => console.log('[MOCK MySQL] Connection released')
            })
        })
    };
};

const pool = createMockPool();

// Initialize mock database
const initDatabase = async () => {
    console.log('[MOCK MySQL] Initializing database...');
    console.log('[MOCK MySQL] Creating database: clean_energy_db');
    console.log('[MOCK MySQL] Creating tables: users, chart_data');
    console.log('[MOCK MySQL] Inserting default user: raghav');
    console.log('[MOCK MySQL] Database initialization complete');
    return true;
};

// Test connection
const testConnection = async () => {
    console.log('[MOCK MySQL] Connection test successful');
    console.log('[MOCK MySQL] Database: clean_energy_db');
    console.log('[MOCK MySQL] Tables: users, chart_data');
    console.log('[MOCK MySQL] User: raghav');
    return true;
};

module.exports = { pool, initDatabase, testConnection };