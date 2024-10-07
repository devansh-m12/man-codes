export async function GET(request: Request) {
    try {
        const data = await fetch('https://leetcode.com/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query pastContests($pageNo: Int, $numPerPage: Int) {
                        pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
                            pageNum
                            currentPage
                            totalNum
                            numPerPage
                            data {
                                title
                                titleSlug
                            }
                        }
                    }
                `,
                variables: {
                    pageNo: 1,
                    numPerPage: 10
                },
                operationName: "pastContests"
            })
        });
        const response = await data.json();
        return new Response(JSON.stringify(response), {
            headers: {
                'content-type': 'application/json'
            }
        });
        
    } catch (error) {
        // Handle the error
        console.error('An error occurred:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}