'use client';
import axios , {AxiosError} from 'axios';
import React, { useEffect, useState } from 'react';
import { ApiResponse } from '@/types/apiResponse';
import { redirect } from 'next/dist/server/api-utils';

export default function ContestList () {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch the contests
    const fetchMessages = async () => {
        try {
            const response = await axios.get<ApiResponse>('/api/get-contests')
            setContests(response?.data?.data?.pastContests?.data)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching Contest :: ", error)
            const axiosError = error as AxiosError<ApiResponse>
            setError(axiosError.response?.data.message || 'An error occurred')
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchMessages();
    }, []);
    console.log(contests)
    
    return (
        <div>
            <h1>Contest List</h1>
            <p>Here is a list of all the contests</p>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {contests.map((contest: any) => (
                    <li key={contest.titleSlug} onClick={() => window.location.href = `/contest/${contest.titleSlug}`}>
                        <h2>{contest.title}</h2>
                    </li>
                ))}
            </ul>
        </div>
    );
}