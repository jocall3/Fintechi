

import { MOCK_MARQETA_USERS, MOCK_MARQETA_CARD_PRODUCTS, MOCK_MARQETA_CARDS } from '../data/mockData';
import type { MarqetaUser, MarqetaCard, MarqetaTransaction } from '../types';

// In-memory store for the simulation
let users: MarqetaUser[] = [...MOCK_MARQETA_USERS];
let cards: MarqetaCard[] = [...MOCK_MARQETA_CARDS];

// Helper to generate random tokens
const generateToken = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 10)}`;

// Main simulation function
export const simulateMarqetaApiCall = async (
    method: string,
    path: string,
    body: any
): Promise<{ status: number, data: any }> => {

    // Add a simulated network delay
    await new Promise(res => setTimeout(res, 500 + Math.random() * 500));

    const now = new Date().toISOString();

    // User endpoints
    if (path === '/users' && method.toUpperCase() === 'GET') {
        return { status: 200, data: { count: users.length, data: users, start_index: 0, end_index: users.length -1 } };
    }

    if (path === '/users' && method.toUpperCase() === 'POST') {
        const { first_name, last_name, email } = body;
        if (!first_name || !last_name) {
            return { status: 400, data: { error_code: "400001", error_message: 'first_name and last_name are required' } };
        }
        const newUser: MarqetaUser = {
            token: generateToken('user'),
            first_name,
            last_name,
            email: email || `${first_name.toLowerCase()}.${last_name.toLowerCase()}@example.com`,
            active: true,
            created_time: now,
            last_modified_time: now,
        };
        users.push(newUser);
        return { status: 201, data: newUser };
    }

    const userTokenMatch = path.match(/^\/users\/([\w-]+)$/);
    if (userTokenMatch && method.toUpperCase() === 'GET') {
        const token = userTokenMatch[1];
        const user = users.find(u => u.token === token);
        return user ? { status: 200, data: user } : { status: 404, data: { error_code: "404001", error_message: 'User not found' } };
    }

    if (userTokenMatch && method.toUpperCase() === 'PUT') {
        const token = userTokenMatch[1];
        const userIndex = users.findIndex(u => u.token === token);
        if (userIndex === -1) {
            return { status: 404, data: { error_code: "404001", error_message: 'User not found' } };
        }
        users[userIndex] = { ...users[userIndex], ...body, last_modified_time: now };
        return { status: 200, data: users[userIndex] };
    }

    // Card endpoints
    if (path === '/cards' && method.toUpperCase() === 'POST') {
        const { user_token, card_product_token } = body;
        if (!user_token || !card_product_token) {
             return { status: 400, data: { error_code: "400002", error_message: 'user_token and card_product_token are required' } };
        }
        const userExists = users.some(u => u.token === user_token);
        const productExists = MOCK_MARQETA_CARD_PRODUCTS.some(p => p.token === card_product_token);

        if (!userExists) {
            return { status: 404, data: { error_code: "404001", error_message: `User with token ${user_token} not found` } };
        }
        if (!productExists) {
            return { status: 404, data: { error_code: "404002", error_message: `Card Product with token ${card_product_token} not found` } };
        }


        const pan = `5${Math.floor(100 + Math.random() * 900)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`;
        const newCard: MarqetaCard = {
            token: generateToken('card'),
            user_token,
            card_product_token,
            last_four: pan.slice(-4),
            pan,
            expiration: '1228', // MMYY
            state: 'ACTIVE',
            created_time: now
        };
        cards.push(newCard);
        return { status: 201, data: newCard };
    }

    // Simulation endpoints
    if (path === '/simulate/authorization' && method.toUpperCase() === 'POST') {
        const { card_token, amount, merchant } = body;
         if (!card_token || !amount) {
             return { status: 400, data: { error_code: "400003", error_message: 'card_token and amount are required' } };
        }
        const card = cards.find(c => c.token === card_token);
        if (!card) {
            return { status: 404, data: { error_code: "404003", error_message: `Card with token ${card_token} not found` } };
        }
        if (card.state !== 'ACTIVE') {
            return { status: 400, data: { error_code: "400101", error_message: 'Card is not active' } };
        }

        const transaction: MarqetaTransaction = {
            token: generateToken('trx'),
            state: 'CLEARED',
            amount,
            card_token,
            user_token: card.user_token,
            merchant: {
                name: merchant || 'Mock Merchant',
                category_code: '5812', // Restaurants
            },
            created_time: now,
        };
        // We don't store transactions in this simple mock, just return it
        return { status: 201, data: { transaction } };
    }


    // Fallback for undefined routes
    return { status: 404, data: { error_code: "404000", error_message: `Endpoint ${method.toUpperCase()} ${path} not found in simulation.` } };
};
