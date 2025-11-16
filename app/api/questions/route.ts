import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/parseQuestions';

export async function GET() {
  try {
    const questions = getAllQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
