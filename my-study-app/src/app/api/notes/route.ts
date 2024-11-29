import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const NOTES_FILE = path.join(process.cwd(), 'data', 'algorithm_notes.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

export async function GET() {
  try {
    if (!fs.existsSync(NOTES_FILE)) {
      return NextResponse.json({});
    }
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}