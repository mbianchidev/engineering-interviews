'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  question: string;
  whyAskIt: string;
}

interface Section {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  questions: Question[];
}

const sections: Section[] = [
  {
    id: 'startup',
    icon: '🚀',
    title: 'Startup-Specific Questions',
    subtitle: 'Essential questions for early-stage and growth-stage startups',
    questions: [
      { question: "What's your current runway?", whyAskIt: 'Assesses financial stability and urgency' },
      { question: "What's your funding stage and when do you plan to raise next?", whyAskIt: 'Understand growth trajectory and dilution risk' },
      { question: "What's your path to profitability?", whyAskIt: 'Shows business acumen and long-term viability' },
      { question: "How much equity would this role include, and what's the vesting schedule?", whyAskIt: 'Compensation clarity' },
      { question: "What's the current burn rate?", whyAskIt: 'Financial health indicator' },
      { question: "Who are your investors, and how involved are they?", whyAskIt: 'Governance and support structure' },
    ],
  },
  {
    id: 'large-company',
    icon: '🏢',
    title: 'Large Company-Specific Questions',
    subtitle: 'Navigate corporate structures and career advancement',
    questions: [
      { question: 'What does the career ladder look like for this role?', whyAskIt: 'Growth potential and structure' },
      { question: "How do promotions work here? What's the typical timeline?", whyAskIt: 'Advancement clarity' },
      { question: 'How much bureaucracy should I expect for decision-making?', whyAskIt: 'Agility vs. process trade-offs' },
      { question: 'How does this team/department fit into the larger org strategy?', whyAskIt: 'Job security and relevance' },
      { question: "What's the mobility like between teams or departments?", whyAskIt: 'Long-term flexibility' },
    ],
  },
  {
    id: 'team-culture',
    icon: '👥',
    title: 'Team & Culture',
    subtitle: 'Understand the day-to-day reality and team dynamics',
    questions: [
      { question: 'What does a typical day/week look like in this role?', whyAskIt: 'Reality check on the job' },
      { question: 'How would you describe the team culture?', whyAskIt: 'Fit assessment' },
      { question: "What's the team's biggest challenge right now?", whyAskIt: 'Transparency and expectations' },
      { question: 'How do you handle disagreements or conflicts on the team?', whyAskIt: 'Conflict resolution culture' },
      { question: "What's the onboarding process like?", whyAskIt: 'Support for new hires' },
      { question: 'Why did the last person in this role leave?', whyAskIt: 'Red flag detector' },
    ],
  },
  {
    id: 'growth',
    icon: '📈',
    title: 'Growth & Development',
    subtitle: 'Investing in your professional trajectory',
    questions: [
      { question: 'What learning & development opportunities are available?', whyAskIt: 'Investment in employees' },
      { question: 'How do you give feedback? How often?', whyAskIt: 'Performance culture' },
      { question: 'What does success look like in the first 90 days?', whyAskIt: 'Clear expectations' },
      { question: 'Can you share an example of someone who grew within the company?', whyAskIt: 'Proof of internal mobility' },
      { question: 'Is there a mentorship program or culture?', whyAskIt: 'Support systems' },
    ],
  },
  {
    id: 'work-life',
    icon: '⚖️',
    title: 'Work-Life Balance & Flexibility',
    subtitle: 'Set realistic expectations for sustainability',
    questions: [
      { question: "What's your remote/hybrid policy?", whyAskIt: 'Flexibility expectations' },
      { question: 'How do you handle on-call or after-hours work?', whyAskIt: 'Boundary expectations' },
      { question: "What's the expected working hours culture?", whyAskIt: 'Actual vs. stated balance' },
      { question: 'How do you prevent burnout on the team?', whyAskIt: 'Employee wellbeing priority' },
      { question: "What's your PTO policy, and do people actually take it?", whyAskIt: 'Real vacation culture' },
    ],
  },
  {
    id: 'technical',
    icon: '🔧',
    title: 'Role & Technical',
    subtitle: 'For engineering and technical roles',
    questions: [
      { question: "What's the tech stack, and are there plans to change it?", whyAskIt: 'Technical alignment' },
      { question: 'How do you balance tech debt vs. new features?', whyAskIt: 'Engineering maturity' },
      { question: 'What does your deployment process look like?', whyAskIt: 'DevOps culture' },
      { question: 'How are technical decisions made?', whyAskIt: 'Autonomy and influence' },
      { question: "What's the ratio of building new things vs. maintaining existing systems?", whyAskIt: 'Role reality' },
    ],
  },
  {
    id: 'red-flags',
    icon: '🚨',
    title: 'Red Flag Detectors',
    subtitle: 'Uncover potential issues before accepting an offer',
    questions: [
      { question: "What's the employee turnover rate?", whyAskIt: 'Retention issues' },
      { question: "What's something the company is actively working to improve?", whyAskIt: 'Self-awareness and honesty' },
      { question: 'How has the company changed in the last year?', whyAskIt: 'Stability and direction' },
      { question: 'What do employees here complain about most?', whyAskIt: 'Hidden problems' },
    ],
  },
];

const proTips = [
  {
    emoji: '🎯',
    title: 'Tailor your questions',
    description: 'Pick 3-5 most relevant based on company stage and your priorities',
  },
  {
    emoji: '🔄',
    title: 'Ask the same question to multiple interviewers',
    description: 'Inconsistent answers reveal misalignment',
  },
  {
    emoji: '💰',
    title: 'Save compensation questions',
    description: 'for HR/recruiter rounds, not technical interviews',
  },
  {
    emoji: '📝',
    title: 'Take notes',
    description: "You're interviewing them too!",
  },
  {
    emoji: '💬',
    title: 'End with confidence',
    description: '"Is there anything about my background that gives you hesitation?" - Shows confidence and gives you a chance to address concerns',
  },
];

export default function AskCompaniesPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <span className="text-6xl mb-4 inline-block animate-bounce-slow">💼</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-4 tracking-tight leading-tight">
            Questions to Ask Companies
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Master the art of interviewing <span className="font-semibold italic text-emerald-600 dark:text-emerald-400">them</span>
          </p>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Your questions reveal your priorities, demonstrate your experience, and help you make informed career decisions. Use this guide to turn interviews into two-way conversations.
          </p>
        </div>

        {/* Expand/Collapse Controls */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={expandAll}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Collapse All
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <div
                key={section.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-4xl" role="img" aria-label={section.title}>
                      {section.icon}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {section.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <svg
                      className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Section Content */}
                <div
                  className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="min-h-0">
                    <div className="px-6 pb-6">
                      <div className="border-t-2 border-slate-100 dark:border-slate-700 pt-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b-2 border-emerald-200 dark:border-emerald-800">
                                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 text-base w-1/2">
                                  Question
                                </th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 text-base w-1/2">
                                  Why Ask It
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.questions.map((q, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-slate-100 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors"
                                >
                                  <td className="py-4 px-4 text-slate-800 dark:text-slate-200 align-top">
                                    <span className="font-medium">{q.question}</span>
                                  </td>
                                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400 align-top">
                                    {q.whyAskIt}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Tips Section */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl shadow-xl border-2 border-amber-200 dark:border-amber-800 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl" role="img" aria-label="Pro Tips">
              💡
            </span>
            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              Pro Tips
            </h2>
          </div>
          <div className="space-y-5">
            {proTips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl flex-shrink-0 mt-1" role="img" aria-label={tip.title}>
                  {tip.emoji}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">
                    {tip.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-8 space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Ready to practice your interview skills?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/topics"
              className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Browse Topics
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center justify-center px-8 py-3 bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Practicing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
