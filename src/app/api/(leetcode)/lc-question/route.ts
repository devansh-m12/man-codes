import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { slug } = await request.json();
        
        const response = await fetch('https://leetcode.com/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query questionTitle($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            questionId
                            questionFrontendId
                            title
                            titleSlug
                            content
                            isPaidOnly
                            difficulty
                            likes
                            dislikes
                            categoryTitle
                        }
                    }
                `,
                variables: {
                    titleSlug: slug
                },
                operationName: "questionTitle"
            })
        });

        const solution =  await fetch('https://leetcode.com/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query communitySolutions($questionSlug: String!, $skip: Int!, $first: Int!, $query: String, $orderBy: TopicSortingOption, $languageTags: [String!], $topicTags: [String!]) {
                        questionSolutions(
                            filters: {questionSlug: $questionSlug, skip: $skip, first: $first, query: $query, orderBy: $orderBy, languageTags: $languageTags, topicTags: $topicTags}
                        ) {
                            hasDirectResults
                            totalNum
                            solutions {
                                id
                                post {
                                    id
                                    content
                                }
                            }
                        }
                    }
                `,
                variables: {
                    query: "",
                    languageTags: [],
                    topicTags: [],
                    questionSlug: slug,
                    skip: 0,
                    first: 1,
                    orderBy: "most_votes"
                },
                operationName: "communitySolutions"
            })
        });

        if (!response.ok || !solution.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${solution.status}`);
        }

        const questionData = await response.json();
        const solutionData = await solution.json();

        if (!questionData.data || !questionData.data.question) {
            return NextResponse.json({ message: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({
            question: questionData.data.question,
            solution: solutionData.data.questionSolutions.solutions[0],
            message: 'Question data fetched successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('An error occurred:', error);
        return NextResponse.json({ 
            message: 'An error occurred while fetching question data',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}