export async function POST(request: Request, response: Response) {
    try {
        const {slug} = await request.json();
        // Fetch the data from the API
        try {
            const data = await fetch('https://leetcode.com/graphql/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    operationName: "mostRecentPastContest",
                    variables: {},
                    query: `
                        query mostRecentPastContest {
                            pastContests(pageNo: 1, numPerPage: 10) {
                                data {
                                    title
                                    titleSlug
                                    questions {
                                        titleSlug
                                        __typename
                                        credit
                                        title
                                    }
                                    __typename
                                }
                                __typename
                            }
                        }
                    `
                })
            });
            const contests = await data.json();
            const contestData = contests.data.pastContests.data.find(
                (contest: any) => contest.titleSlug === slug
            );

            if (!contestData) {
                return Response.json({
                    message: 'Contest not found'
                }, { status: 404 });
            }

            const formattedContest = {
                title: contestData.title,
                titleSlug: contestData.titleSlug,
                questions: contestData.questions.map((q: any) => ({
                    titleSlug: q.titleSlug,
                    credit: q.credit,
                    title: q.title
                }))
            };
            // Return the data
            return Response.json({
                contest: formattedContest,
                message: 'Contest questions fetched successfully'
            }, { status: 200 });
        } catch (error) {
            // Handle the error
            console.error('An error occurred while featching contest questions:', error);
            return Response.json({ 
                error: error,
                message: 'An error occurred while featching contest questions'
             }, { status: 500 });
            
        }
        
    } catch (error) {
        // Handle the error
        console.error('An error occurred:', error);
        return Response.json({ error: error }, { status: 500 });
    }
} 