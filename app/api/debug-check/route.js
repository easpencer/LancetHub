import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'This is from LancetHubCurrentBackup!',
    timestamp: new Date().toISOString(),
    hasPolicy: true,
    version: 'policy-investment-enabled'
  });
}