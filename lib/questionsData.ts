// This file provides questions data for client-side usage
// Data is loaded from the pre-generated JSON file

import questionsData from '../public/questions.json';
import type { Question, Category } from './parseQuestions';

export const allCategories: Category[] = questionsData.categories as Category[];
export const allQuestions: Question[] = questionsData.questions as Question[];

