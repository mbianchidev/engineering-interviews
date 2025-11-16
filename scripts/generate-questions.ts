import fs from 'fs';
import path from 'path';
import { parseReadme, getAllQuestions } from '../lib/parseQuestions.js';

// Generate questions data at build time
const categories = parseReadme();
const questions = getAllQuestions();

const data = {
  categories,
  questions,
};

const outputDir = path.join(process.cwd(), 'public');
const outputFile = path.join(outputDir, 'questions.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

console.log(`Generated questions data at ${outputFile}`);
console.log(`Total questions: ${questions.length}`);
console.log(`Total categories: ${categories.length}`);
