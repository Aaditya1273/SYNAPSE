import { NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit-server";

export async function POST(request: Request): Promise<Response> {
    try {
        const { action } = await request.json();

        // We explicitly name it WORLD_RP_SIGNING_KEY to match PrivaCRE naming conventions
        const signingKey = process.env.WORLD_RP_SIGNING_KEY || process.env.RP_SIGNING_KEY;

        if (!signingKey) {
            console.error("Missing RP_SIGNING_KEY environment variable. Signer cannot operate.");
            return NextResponse.json(
                { error: "World ID Server Setup Incomplete. Missing RP_SIGNING_KEY in .env" },
                { status: 500 }
            );
        }

        // signRequest natively takes action string and secret key string, outputting cryptographic block
        const { sig, nonce, createdAt, expiresAt } = signRequest(action, signingKey);

        // Return the specific JSON envelope that useWorldID.ts expects ({ data: { ... } })
        return NextResponse.json({
            data: {
                sig,
                nonce,
                created_at: createdAt,
                expires_at: expiresAt,
            }
        });
    } catch (error) {
        console.error("Failed to generate RP signature:", error);
        return NextResponse.json({ error: "Internal Server Error during RP Signing" }, { status: 500 });
    }
}
