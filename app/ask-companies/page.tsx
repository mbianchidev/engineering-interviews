'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Icon from '../components/Icon';

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
    emoji: '🤔',
    title: 'Address concerns proactively',
    description: '"Is there anything about my background that gives you hesitation?" - Shows confidence and gives you a chance to address concerns',
  },
  {
    emoji: '💬',
    title: 'End with confidence',
    description: '"If you were to hire me today, what would be my biggest strength and how would you put it to use?" - Helps them see you as already hired and sets the right tone for the next round',
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
    <div className="page-width content-page reading-width">
      <PageHeader
        eyebrow="The conversation goes both ways"
        title="Questions to Ask Companies"
        description="You're choosing a team, too. Ask about the work, the culture, and the things that matter to you before you say yes."
      />
      <div className="company-toolbar">
        <button onClick={expandAll} className="button button-primary">Expand All</button>
        <button onClick={collapseAll} className="button button-secondary">Collapse All</button>
      </div>
      <div className="company-sections">
        {sections.map(section => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <section key={section.id} className="company-section">
              <h2>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="company-trigger"
                  aria-expanded={isExpanded}
                  aria-controls={`company-${section.id}`}
                >
                  <span className="company-symbol" aria-hidden="true">{section.icon}</span>
                  <span className="company-trigger-text">
                    <span className="company-title">{section.title}</span>
                    <span className="company-subtitle">{section.subtitle}</span>
                  </span>
                  <Icon name="chevron" className={`chevron${isExpanded ? ' is-open' : ''}`} />
                </button>
              </h2>
              <div id={`company-${section.id}`} hidden={!isExpanded} className="company-table-wrapper">
                <table className="company-table">
                  <thead><tr><th scope="col">Question</th><th scope="col">Why Ask It</th></tr></thead>
                  <tbody>
                    {section.questions.map((question, index) => (
                      <tr key={index}><td>{question.question}</td><td>{question.whyAskIt}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
      <section className="company-tips">
        <h2>Pro Tips</h2>
        <div className="tips-grid">
          {proTips.map((tip, index) => (
            <div key={index} className="tip">
              <span className="tip-symbol" aria-hidden="true">{tip.emoji}</span>
              <div><h3>{tip.title}</h3><p>{tip.description}</p></div>
            </div>
          ))}
        </div>
      </section>
      <div className="company-cta">
        <p>Ready to work on your side of the conversation?</p>
        <div className="button-row">
          <Link href="/topics" className="button button-secondary">Browse Topics</Link>
          <Link href="/practice" className="button button-primary">Start Practicing<Icon name="arrow" /></Link>
        </div>
      </div>
    </div>
  );
}
