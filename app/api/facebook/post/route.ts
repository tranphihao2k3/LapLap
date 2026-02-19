import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { message, link, accessToken, groupIds } = await req.json();

        if (!message || !accessToken || !groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields (message, accessToken, groupIds)' },
                { status: 400 }
            );
        }

        const results = [];

        for (const groupId of groupIds) {
            try {
                // Post to Group Feed
                // Note: Posting as a User to a Group is deprecated/restricted.
                // Posting as a Page to a Group is supported if the Page is an admin.
                // Endpoint: /{group-id}/feed
                const fbUrl = `https://graph.facebook.com/v19.0/${groupId}/feed`;

                const response = await fetch(fbUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        link: link, // Optional link attachment
                        access_token: accessToken,
                    }),
                });

                const data = await response.json();

                if (data.id) {
                    results.push({ groupId, success: true, postId: data.id });
                } else {
                    results.push({
                        groupId,
                        success: false,
                        error: data.error?.message || 'Unknown error',
                        code: data.error?.code
                    });
                }
            } catch (err: any) {
                results.push({ groupId, success: false, error: err.message });
            }
        }

        const successCount = results.filter(r => r.success).length;

        return NextResponse.json({
            success: true,
            total: groupIds.length,
            successCount,
            results
        });

    } catch (error: any) {
        console.error('Facebook API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
