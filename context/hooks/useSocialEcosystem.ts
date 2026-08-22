// context/hooks/useSocialEcosystem.ts
import { useState } from 'react';
import { User, Post, Business, LendingPoolStats } from '../../types';
import { MOCK_USERS, MOCK_POSTS, MOCK_BUSINESSES, MOCK_LENDING_POOL } from '../../data/mockData';

export const useSocialEcosystem = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
    const [lendingPool, setLendingPool] = useState<LendingPoolStats>(MOCK_LENDING_POOL);

    return {
        users, setUsers,
        posts, setPosts,
        businesses, setBusinesses,
        lendingPool, setLendingPool,
    };
};