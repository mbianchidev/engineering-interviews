import fs from 'fs';
import path from 'path';

export interface Question {
  id: string;
  text: string;
  category: string;
  subcategory?: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  questions: Question[];
}

export interface Subcategory {
  id: string;
  name: string;
  questions: Question[];
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function parseReadme(): Category[] {
  const readmePath = path.join(process.cwd(), 'README.md');
  const content = fs.readFileSync(readmePath, 'utf-8');
  const lines = content.split('\n');
  
  const categories: Category[] = [];
  let currentCategory: Category | null = null;
  let currentSubcategory: Subcategory | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Main category (# Title)
    if (line.match(/^# [A-Z]/)) {
      const categoryName = line.replace(/^# /, '');
      
      // Skip certain sections
      if (categoryName === 'Engineering interviews' || 
          categoryName === 'Useful resources' || 
          categoryName === 'STAR Method' ||
          categoryName === 'Intro' ||
          categoryName === 'Behavioral (I don\'t usually ask these questions)' ||
          categoryName === 'Outro') {
        currentCategory = null;
        currentSubcategory = null;
        continue;
      }
      
      currentCategory = {
        id: generateId(categoryName),
        name: categoryName,
        subcategories: [],
        questions: []
      };
      currentSubcategory = null;
      categories.push(currentCategory);
    }
    // Subcategory (## Title)
    else if (line.match(/^## /)) {
      const subcategoryName = line.replace(/^## /, '');
      
      if (currentCategory) {
        currentSubcategory = {
          id: generateId(subcategoryName),
          name: subcategoryName,
          questions: []
        };
        currentCategory.subcategories.push(currentSubcategory);
      }
    }
    // Question (starts with -)
    else if (line.match(/^- [A-Z]/)) {
      const questionText = line.replace(/^- /, '');
      
      if (currentCategory) {
        const question: Question = {
          id: generateId(questionText),
          text: questionText,
          category: currentCategory.name,
          subcategory: currentSubcategory?.name
        };
        
        if (currentSubcategory) {
          currentSubcategory.questions.push(question);
        } else {
          currentCategory.questions.push(question);
        }
      }
    }
  }
  
  return categories;
}

export function getAllQuestions(): Question[] {
  const categories = parseReadme();
  const allQuestions: Question[] = [];
  
  categories.forEach(category => {
    allQuestions.push(...category.questions);
    category.subcategories.forEach(subcategory => {
      allQuestions.push(...subcategory.questions);
    });
  });
  
  return allQuestions;
}
