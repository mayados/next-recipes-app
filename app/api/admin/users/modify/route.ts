import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const clerkUserId = data.get('clerkUserId')?.toString();
    const userName = data.get('userName')?.toString();
    const userMail = data.get('userMail')?.toString();
    const userMailId = data.get('userMailId')?.toString();
    // verify if it's a File (as clerk expects)
    const userPicture = data.get('userPicture') as File | null; 

    console.log("Received data:", { clerkUserId, userName, userMail, userMailId, userPicture });

    try {

        // update userPicture
        let profileImageUrl = null;
        if (userPicture) {
            const formData = new FormData();
            formData.append("file", userPicture);

            const pictureResponse = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}/profile_image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                },
                // send file to clerk
                body: formData,  
            });

            if (!pictureResponse.ok) {
                const errorMessage = await pictureResponse.text();
                console.warn(`Warning: Failed to upload profile image. Response: ${errorMessage}`);
            } else {
                const pictureData = await pictureResponse.json();
                console.log("Response from Clerk for profile image:", pictureData);
                // Retrieve Url
                profileImageUrl = pictureData.profile_image_url || null;
                if (profileImageUrl) {
                    console.log('Image uploaded successfully:', profileImageUrl);
                } else {
                    console.warn('No profile image URL found in the response');
                }
            }
        }

        // Update mail
        const mail = await fetch(`https://api.clerk.dev/v1/email_addresses/${userMailId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email_address: userMail, 
                "verified": true,
                "primary": true 
            }),
        });

        if (!mail.ok) {
            const errorMessage = await mail.text();
            throw new Error(`Error updating email: ${errorMessage}`);
        }

        const newMail = await mail.json();
        console.log("Updated email:", newMail);

        // Update username
        const usernameResponse = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: userName }),
        });

        if (!usernameResponse.ok) {
            const errorMessage = await usernameResponse.text();
            throw new Error(`Error updating username: ${errorMessage}`);
        }

        const newUserName = await usernameResponse.json();
        console.log("Updated username:", newUserName);


        return NextResponse.json(
            {
                message: "User updated successfully",
                newUserName,
                newMail,
                profileImageUrl,  
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error with user's update:", error);
        return new NextResponse("Error updating the ingredient", {status: 500})
    }
}
