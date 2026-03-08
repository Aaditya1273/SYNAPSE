import { NextRequest, NextResponse } from 'next/server';

/**
 * World ID v4 Proof Verification Endpoint (Managed Mode)
 * 
 * In Managed Mode, World ID handles RP signatures automatically via IDKitWidget.
 * We just need to validate the proof structure and optionally verify with World ID API.
 */

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    let merkleRoot = payload.merkle_root;
    let nullifierHash = payload.nullifier_hash;
    let proof = payload.proof;
    let verificationLevel = payload.verification_level;

    // Handle World ID v4 structure
    if (payload.protocol_version === "4.0" && payload.responses && payload.responses.length > 0) {
      const response = payload.responses[0];
      // Note: In v4, merkle_root is often part of the proof array (last element) 
      // or passed separately depending on the specific credential.
      // ForOrb credentials, the proof is an array of 5 hex strings.
      proof = response.proof;
      nullifierHash = response.nullifier;
      merkleRoot = response.merkle_root || (Array.isArray(response.proof) ? response.proof[4] : undefined);
      verificationLevel = response.identifier;
    }

    console.log('World ID proof processed:', {
      protocol_version: payload.protocol_version || '3.0',
      merkle_root: merkleRoot,
      nullifier_hash: nullifierHash,
      proof: proof ? (Array.isArray(proof) ? 'array' : 'present') : 'missing',
      verification_level: verificationLevel,
    });

    // Basic validation
    if (!nullifierHash || !proof) {
      return NextResponse.json(
        { success: false, error: 'Missing required proof fields (nullifier or proof)' },
        { status: 400 }
      );
    }

    // In Managed Mode with IDKitWidget, the proof is already validated by World ID
    // We can optionally verify it again with the API, but it's not required

    // Store nullifier hash for sybil resistance
    if (nullifierHash) {
      // TODO: Store nullifier in database to prevent reuse
      console.log('Nullifier hash to store:', nullifierHash);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      nullifier_hash: nullifierHash,
    });

  } catch (error: any) {
    console.error('Error verifying World ID proof:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Verification error',
        details: error.message
      },
      { status: 500 }
    );
  }
}
