import Link from "next/link";
import Icon from './components/Icon';
import { allCategories, allQuestions } from '@/lib/questionsData';
import { getTopicPresentation } from '@/lib/topicPresentation';

export default function Home() {
  const preview = allQuestions.find(question => question.subcategory === 'Latency and Performance');

  return (
    <div className="page-width home-page">
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-intro">
          <p className="eyebrow"><span className="accent-dot" />Engineering interview practice</p>
          <h1 id="home-title">Think it through.<br /><span>Say it out loud.</span></h1>
          <p className="hero-description">
            The best preparation is practice. Work through real engineering questions,
            explain your trade-offs, and get comfortable with what comes next.
          </p>
          <div className="button-row">
            <Link href="/practice" className="button button-primary">Start Practicing<Icon name="arrow" /></Link>
            <Link href="/topics" className="button button-secondary">Browse Topics</Link>
          </div>
          <p className="hero-note">10 questions a round. Your answers stay in your browser.</p>
        </div>

        {preview && (
          <aside className="question-preview" aria-label="Sample interview question">
            <div className="preview-heading">
              <span className="preview-label"><Icon name="activity" />A question to think about</span>
              <span className="preview-time"><Icon name="timer" />5 min</span>
            </div>
            <div className="preview-body">
              <span className="preview-q" aria-hidden="true">Q.</span>
              <blockquote>{preview.text}</blockquote>
            </div>
            <div className="preview-footer">
              <span>{preview.category}<span className="preview-separator">/</span>{preview.subcategory}</span>
              <p>No memorized answer. Show how you think.</p>
            </div>
          </aside>
        )}
      </section>

      <section className="home-paths" aria-labelledby="paths-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Make it your practice</p>
            <h2 id="paths-title">Three ways to get ready.</h2>
          </div>
          <span className="bank-count"><strong>{allQuestions.length}</strong> questions to work through</span>
        </div>
        <div className="route-grid">
          <Link href="/topics" className="route-card">
            <span className="icon-tile"><Icon name="layers" /></span>
            <h3>Browse by Topic</h3>
            <p>Pick a corner of the stack. Explore the questions and write down your thinking.</p>
            <span className="card-link">{allCategories.length} topic areas<Icon name="diagonal" /></span>
          </Link>
          <Link href="/practice" className="route-card">
            <span className="icon-tile"><Icon name="timer" /></span>
            <h3>Start Practicing</h3>
            <p>One question at a time. Choose your pace, run a round, and reflect on how it went.</p>
            <span className="card-link">Easy, standard, or hard<Icon name="diagonal" /></span>
          </Link>
          <Link href="/ask-companies" className="route-card">
            <span className="icon-tile"><Icon name="company" /></span>
            <h3>Questions to Ask Companies</h3>
            <p>Interview them, too. Ask about the team, the work, and what actually matters to you.</p>
            <span className="card-link">Make it a two-way conversation<Icon name="diagonal" /></span>
          </Link>
        </div>
      </section>

      <div className="coverage-strip" aria-label="Question coverage">
        <span className="eyebrow">Across the stack</span>
        {allCategories.map(category => (
          <span key={category.id}>{getTopicPresentation(category.id).label}</span>
        ))}
      </div>
    </div>
  );
}
