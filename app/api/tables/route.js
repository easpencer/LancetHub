import { NextResponse } from 'next/server';
import { getAirtableTables } from '../../../utils/airtable';

export async function GET() {
  try {
    const tables = await getAirtableTables();
    return NextResponse.json({ tables });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
