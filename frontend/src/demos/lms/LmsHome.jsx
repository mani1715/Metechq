import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Users, Award, Star, Clock, PlayCircle, 
  CheckCircle, Search, Trophy, ArrowRight, Sparkles, 
  Play, Pause, Check, ShieldCheck, GraduationCap, FileCheck
} from 'lucide-react';
import { courses, instructors } from '../../data/lmsData';
import './lms.css';

const LMS_CATEGORIES = [
  'All Courses',
  'Web Development',
  'Data Science & AI',
  'Design & UI/UX',
  'Cloud & DevOps'
];

export default function LmsHome() {
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewCourse, setActivePreviewCourse] = useState(null);
  
  // Interactive Lesson Video Modal State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeTabModal, setActiveTabModal] = useState('video'); // 'video' | 'quiz'
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(null);

  // Certificate Verification Simulator
  const [certInputId, setCertInputId] = useState('EDU-2026-8492');
  const [verifiedCert, setVerifiedCert] = useState(null);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchCat = activeCategory === 'All Courses' || 
        c.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
      
      const matchSearch = !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleOpenPreview = (course) => {
    setActivePreviewCourse(course);
    setIsPlayingVideo(true);
    setActiveTabModal('video');
    setQuizAnswer(null);
    setQuizScore(null);
  };

  const handleVerifyCertificate = (e) => {
    e.preventDefault();
    setVerifiedCert({
      id: certInputId,
      studentName: 'Julian Sterling',
      courseName: 'Full-Stack React & Fast-API Microservices Architecture',
      issueDate: 'March 2026',
      grade: 'Top 2% Distinction'
    });
  };

  return (
    <div className="lms-demo-page">

      {/* Hero Section */}
      <section className="lms-hero-modern">
        <div className="lms-hero-backdrop"></div>
        <div className="lms-container lms-hero-inner">
          <div className="lms-badge-ribbon">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>Next-Generation Career Transformation Platform</span>
          </div>

          <h1 className="lms-headline">
            Master High-Impact Skills, <br />
            <span className="text-gradient-indigo">Accelerate Your Future.</span>
          </h1>

          <p className="lms-subheadline">
            Learn directly from Senior Silicon Valley Engineers, AI Researchers, and Design Directors. 
            Immersive projects, interactive code sandboxes, and globally accredited credentials.
          </p>

          {/* Search Bar in Hero */}
          <div className="lms-search-wrapper">
            <Search className="h-5 w-5 text-indigo-400 search-ico" />
            <input 
              type="text" 
              placeholder="Search 140+ courses, tech stacks, or topics (e.g. React, Python, Cloud)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lms-search-field"
            />
            {searchQuery && (
              <button className="lms-clear-search" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          {/* Platform Key Stats */}
          <div className="lms-stats-counter-row">
            <div className="lms-stat-item">
              <strong>250,000+</strong>
              <span>Active Students</span>
            </div>
            <div className="stat-v-line"></div>
            <div className="lms-stat-item">
              <strong>94.6%</strong>
              <span>Career Placement</span>
            </div>
            <div className="stat-v-line"></div>
            <div className="lms-stat-item">
              <strong>4.9 ★</strong>
              <span>Average Course Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Course Explorer */}
      <section className="lms-catalog-section">
        <div className="lms-container">
          <div className="lms-catalog-header">
            <div>
              <span className="lms-pretitle">CURATED CURRICULUM</span>
              <h2 className="lms-maintitle">Industry-Aligned Specializations</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="lms-category-pills">
              {LMS_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`lms-cat-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lms-course-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="lms-course-card">
                <div className="course-media-box">
                  <img src={course.image} alt={course.title} className="course-thumb" />
                  <span className="course-level-tag">{course.level || 'All Levels'}</span>
                  <button 
                    className="preview-play-btn"
                    onClick={() => handleOpenPreview(course)}
                    title="Watch Sample Lesson"
                  >
                    <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                  </button>
                </div>

                <div className="course-card-body">
                  <div className="course-category-meta">{course.category}</div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-desc">{course.description}</p>

                  <div className="course-specs-bar">
                    <div className="spec-item">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{course.duration || '24h Total'}</span>
                    </div>
                    <div className="spec-item">
                      <Users className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{(course.students || 1420).toLocaleString()} enrolled</span>
                    </div>
                    <div className="spec-item">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating || '4.9'}</span>
                    </div>
                  </div>

                  <div className="course-instructor-row">
                    <div className="inst-avatar">
                      {course.instructor ? course.instructor[0] : 'E'}
                    </div>
                    <div className="inst-info">
                      <span className="inst-name">{course.instructor || 'Senior Instructor'}</span>
                      <small>Silicon Valley Lead</small>
                    </div>
                  </div>

                  <div className="course-footer-row">
                    <div className="price-tag">
                      <span className="course-price">${course.price}</span>
                      {course.originalPrice && (
                        <span className="course-old-price">${course.originalPrice}</span>
                      )}
                    </div>
                    <button 
                      className="enroll-btn"
                      onClick={() => handleOpenPreview(course)}
                    >
                      <PlayCircle className="h-4 w-4 mr-1.5" />
                      Lesson Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Verification Simulator Section */}
      <section className="lms-certificate-section">
        <div className="lms-container">
          <div className="certificate-simulator-card">
            <div className="cert-sim-grid">
              <div>
                <span className="cert-pre">BLOCKCHAIN-VERIFIED CREDENTIALS</span>
                <h2 className="cert-title">Verify Graduate Certification</h2>
                <p className="cert-desc">
                  Every EduLearn credential contains a tamper-proof cryptographic signature. 
                  Employers can verify learner competency instantly.
                </p>

                <form onSubmit={handleVerifyCertificate} className="cert-form">
                  <div className="cert-input-row">
                    <input 
                      type="text" 
                      value={certInputId}
                      onChange={(e) => setCertInputId(e.target.value)}
                      placeholder="e.g. EDU-2026-8492"
                      className="cert-input"
                    />
                    <button type="submit" className="cert-submit-btn">
                      Verify Credential
                    </button>
                  </div>
                </form>
              </div>

              {/* Rendered Certificate Card */}
              <div className="cert-diploma-preview">
                {verifiedCert ? (
                  <div className="diploma-frame">
                    <div className="diploma-badge">
                      <Award className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="diploma-institution">EDULEARN GLOBAL ACADEMY</span>
                    <h4 className="diploma-title">Certificate of Professional Mastery</h4>
                    <span className="diploma-granted">PROUDLY PRESENTED TO</span>
                    <h3 className="diploma-student">{verifiedCert.studentName}</h3>
                    <p className="diploma-course">for successfully completing {verifiedCert.courseName}</p>
                    <div className="diploma-meta-footer">
                      <span>ID: {verifiedCert.id}</span>
                      <span>Verified: {verifiedCert.issueDate}</span>
                      <span className="text-emerald-400">Status: Authenticated ✓</span>
                    </div>
                  </div>
                ) : (
                  <div className="diploma-placeholder">
                    <FileCheck className="h-12 w-12 text-indigo-400 mb-3 opacity-60" />
                    <p>Enter any Certificate ID to inspect verified graduate transcript.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Lesson Video Player Modal */}
      {activePreviewCourse && (
        <div className="lms-modal-backdrop">
          <div className="lms-modal-window">
            <button className="lms-modal-close" onClick={() => setActivePreviewCourse(null)}>×</button>

            <div className="modal-tabs-header">
              <button 
                className={`modal-tab-pill ${activeTabModal === 'video' ? 'active' : ''}`}
                onClick={() => setActiveTabModal('video')}
              >
                <PlayCircle className="h-4 w-4 mr-1.5" />
                Lesson 1.4: Architecture Overview
              </button>
              <button 
                className={`modal-tab-pill ${activeTabModal === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTabModal('quiz')}
              >
                <FileCheck className="h-4 w-4 mr-1.5" />
                Interactive Checkpoint Quiz
              </button>
            </div>

            {/* TAB 1: VIDEO LESSON */}
            {activeTabModal === 'video' && (
              <div className="video-player-container">
                <div className="video-screen-mock">
                  <div className="video-screen-overlay">
                    <span className="lesson-badge">HIGH DEFINITION (1080P 60FPS)</span>
                    <h3 className="lesson-title">{activePreviewCourse.title}</h3>
                    <p className="lesson-author">Taught by {activePreviewCourse.instructor || 'Senior Architect'}</p>
                    
                    <button 
                      className="big-play-toggle"
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    >
                      {isPlayingVideo ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </button>
                  </div>

                  <div className="video-player-controls">
                    <div className="video-scrubber">
                      <div className="scrubber-fill" style={{ width: isPlayingVideo ? '48%' : '20%' }}></div>
                    </div>
                    <div className="controls-row">
                      <span>{isPlayingVideo ? '09:24 / 19:40' : '03:12 / 19:40'}</span>
                      <span className="quality-pill">HD 1080p</span>
                    </div>
                  </div>
                </div>

                <div className="lesson-notes-box">
                  <h4>Key Takeaways in this Chapter:</h4>
                  <ul>
                    <li>Microservices decoupling patterns with FastAPI & Async event workers</li>
                    <li>Handling idempotent webhook deliveries with Redis cache keys</li>
                    <li>Structuring container images for ultra-fast Docker deployments</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE QUIZ */}
            {activeTabModal === 'quiz' && (
              <div className="quiz-container">
                <span className="quiz-qnum">QUESTION 1 OF 1</span>
                <h3 className="quiz-question">
                  What is the primary advantage of utilizing asynchronous ASGI servers (such as Uvicorn) with FastAPI?
                </h3>

                <div className="quiz-options-list">
                  {[
                    { id: 'A', text: 'It enforces synchronous single-threaded blocking execution.' },
                    { id: 'B', text: 'It provides non-blocking concurrency, allowing thousands of concurrent I/O operations without thread exhaustion.', isCorrect: true },
                    { id: 'C', text: 'It removes the requirement for database indices.' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      className={`quiz-option-btn ${quizAnswer === opt.id ? (opt.isCorrect ? 'correct' : 'incorrect') : ''}`}
                      onClick={() => {
                        setQuizAnswer(opt.id);
                        setQuizScore(opt.isCorrect ? 'Correct! +100 XP' : 'Incorrect. Try again!');
                      }}
                    >
                      <span className="opt-letter">{opt.id}</span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {quizScore && (
                  <div className={`quiz-feedback-box ${quizScore.includes('Correct') ? 'success' : 'fail'}`}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>{quizScore}</span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
