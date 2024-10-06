'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/apiResponse';

export default function ContestPage() {
    const params = useParams();
    const slug = params.slug;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [contest, setContest] = useState<any>(null);

    const fetchContestQuestions = async () => {
        try {
            const response : any= await axios.post<ApiResponse>('/api/contest-questions', {
                slug: slug
            });
            setContest(response?.data?.contest);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching Contest :: ", err);
            if (err instanceof AxiosError) {
                setError(err.response?.data.message || 'An error occurred while fetching contest questions');
            } else {
                setError('An unexpected error occurred');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContestQuestions();
    }, [slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!contest) {
        return <div>No questions found for this contest.</div>;
    }
    console.log(contest);

    return (
        <div>
            <h1>Contest: {contest.title}</h1>
            <p>Contest Slug: {slug}</p>
            <h2>Questions:</h2>
            <ul>
                {contest?.questions?.map((question: any, index: number) => (
                    <li key={index}>
                        <h3>{question.title}</h3>
                        <p>Difficulty: {question.credit}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
