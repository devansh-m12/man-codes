export async function GET(request: Request) {
    try {
        const data = await fetch('https://leetcode.com/graphql/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "query": "\n    query pastContests($pageNo: Int, $numPerPage: Int) {\n  pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {\n    pageNum\n    currentPage\n    totalNum\n    numPerPage\n    data {\n      title\n      titleSlug\n   }\n  }\n}\n    ",
                "variables": {
                    "pageNo": 1
                },
                "operationName": "pastContests"
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