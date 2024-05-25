// const BASE_URL = 'https://guild-web-app.ru/api';
const BASE_URL = 'http://localhost:8000/api';

async function fetchUser(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok && response.status === 404) {
        return null;  // Handle user not found as a normal flow
    }
    return response.json();  // User data
}

async function createUser(userData) {
    const response = await fetch(`${BASE_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error(`Failed to create user: ${await response.text()}`);
    }
    return response.json();
}

async function updateUser(userId, userData) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error(`Failed to update user: ${await response.text()}`);
    }
    return response.json();
}

async function fetchUsers() {
    const response = await fetch(`${BASE_URL}/users/`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

async function fetchUnclaimedRewards(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}/unclaimed_rewards`);
    if (!response.ok) {
        throw new Error('Failed to fetch unclaimed rewards');
    }
    return response.json();
}

async function claimReward(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}/claim_reward`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Failed to claim reward');
    }
    return response.json();
}


export { fetchUser, createUser, updateUser, fetchUsers, fetchUnclaimedRewards, claimReward};
