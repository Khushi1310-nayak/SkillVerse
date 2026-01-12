import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Award, CheckCircle, XCircle, RefreshCcw, Download } from 'lucide-react';
import { COURSES } from '../constants';
import { storageService } from '../services/storageService';
import { Course } from '../types';
import { AIAssistant } from './AIAssistant';

export const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = COURSES.find(c => c.id === id);
  
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    // Load existing progress
    if (id) {
        const existing = storageService.getProgress(id);
        if (existing && existing.passed) {
            setPassed(true);
            setScore(existing.score);
            setQuizSubmitted(true);
        }
    }
  }, [id]);

  if (!course) return <div>Course not found</div>;

  const handleOptionSelect = (optionIndex: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitQuiz = () => {
    let correctCount = 0;
    course.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correctCount++;
    });

    const finalScore = Math.round((correctCount / course.quiz.length) * 100);
    const isPassed = finalScore >= 70;

    setScore(finalScore);
    setPassed(isPassed);
    setQuizSubmitted(true);

    storageService.saveProgress({
      courseId: course.id,
      completed: true,
      score: finalScore,
      passed: isPassed,
      completedDate: new Date().toLocaleDateString()
    });
  };

  const resetQuiz = () => {
    setQuizSubmitted(false);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setScore(0);
    setPassed(false);
  };

  // Remove HTML tags for raw context for AI
  const cleanContent = course.content.replace(/<[^>]*>?/gm, '');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in relative">
      <AIAssistant courseTitle={course.title} courseContext={cleanContent} />

      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-6">
        <Link to={`/category/${course.categoryId}`} className="inline-flex items-center text-textMuted hover:text-textMain transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back
        </Link>
        
        <div className="bg-glass border border-white/20 dark:border-white/10 rounded-2xl p-6 sticky top-28">
           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <BookOpen className="text-white" />
           </div>
           <h2 className="text-xl font-bold text-textMain mb-2">{course.title}</h2>
           <div className="flex flex-col gap-2 mt-6">
             <button 
                onClick={() => setActiveTab('learn')}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'learn' ? 'bg-black/5 dark:bg-white/10 text-textMain font-medium' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
             >
               <span>Notes & Resources</span>
               {activeTab === 'learn' && <div className="w-2 h-2 rounded-full bg-primaryLight" />}
             </button>
             <button 
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'quiz' ? 'bg-black/5 dark:bg-white/10 text-textMain font-medium' : 'text-textMuted hover:bg-black/5 dark:hover:bg-white/5'}`}
             >
               <span>Final Quiz</span>
               {passed ? <CheckCircle size={16} className="text-success" /> : <div className="w-2 h-2 rounded-full border border-textMuted" />}
             </button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        <div className="bg-glass border border-white/20 dark:border-white/10 rounded-3xl p-8 md:p-12 min-h-[600px]">
          
          {activeTab === 'learn' ? (
            <div className="animate-fade-in space-y-8">
              <div className="prose dark:prose-invert prose-lg max-w-none text-textMain">
                 {/* Dangerously setting HTML for this demo, in prod use a sanitizer */}
                 <div dangerouslySetInnerHTML={{ __html: course.content }} />
              </div>
              
              <div className="border-t border-black/5 dark:border-white/10 pt-8 mt-12">
                <h3 className="text-lg font-bold text-textMain mb-4">External Resources</h3>
                <div className="flex flex-wrap gap-4">
                  {course.resources.map((res, i) => (
                    <a key={i} href={res.url} className="px-4 py-2 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-black/5 dark:border-white/10 rounded-lg text-primaryLight text-sm transition-colors">
                      {res.title} ↗
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-8">
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className="bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Proceed to Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in max-w-2xl mx-auto">
              {!quizSubmitted ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-textMain">Question {currentQuestion + 1} <span className="text-textMuted text-lg">/ {course.quiz.length}</span></h2>
                    <div className="h-2 w-32 bg-black/5 dark:bg-white/10 rounded-full">
                       <div className="h-full bg-primaryLight rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / course.quiz.length) * 100}%` }} />
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-xl text-textMain font-medium leading-relaxed">
                      {course.quiz[currentQuestion].question}
                    </p>
                  </div>

                  <div className="space-y-4 mb-10">
                    {course.quiz[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4
                          ${selectedAnswers[currentQuestion] === idx 
                            ? 'bg-primary/20 border-primaryLight text-textMain' 
                            : 'bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/10 text-textMuted hover:bg-white/80 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/20'}
                        `}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                          ${selectedAnswers[currentQuestion] === idx ? 'border-primaryLight' : 'border-black/20 dark:border-white/20'}
                        `}>
                          {selectedAnswers[currentQuestion] === idx && <div className="w-3 h-3 bg-primaryLight rounded-full" />}
                        </div>
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button 
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="px-6 py-2 rounded-lg text-textMuted hover:text-textMain disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {currentQuestion < course.quiz.length - 1 ? (
                      <button 
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-textMain px-6 py-2 rounded-lg transition-colors"
                      >
                        Next
                      </button>
                    ) : (
                      <button 
                        onClick={submitQuiz}
                        disabled={selectedAnswers.length < course.quiz.length}
                        className="bg-gradient-main text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="mb-6 inline-flex p-4 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10">
                    {passed ? <Award size={64} className="text-yellow-400" /> : <XCircle size={64} className="text-red-400" />}
                  </div>
                  
                  <h2 className="text-3xl font-bold text-textMain mb-2">{passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
                  <p className="text-textMuted mb-8">
                    You scored <span className={`font-bold ${passed ? 'text-success' : 'text-red-400'}`}>{score}%</span>. 
                    {passed ? ' You have earned a certificate.' : ' You need 70% to pass.'}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {passed ? (
                       <Link 
                         to={`/certificate/${course.id}`}
                         className="flex items-center justify-center gap-2 bg-gradient-main text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
                       >
                         <Download size={20} /> View Certificate
                       </Link>
                    ) : (
                       <button 
                         onClick={resetQuiz}
                         className="flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-textMain px-8 py-3 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/20 transition-all"
                       >
                         <RefreshCcw size={20} /> Retry Quiz
                       </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
