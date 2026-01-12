import { Category, Course, Company, InterviewQuestion } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'programming',
    title: 'Programming Languages',
    description: 'Master the syntax and paradigms of modern coding.',
    icon: 'Terminal',
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Build the logic required for scalable software.',
    icon: 'Network',
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Create intuitive and beautiful user experiences.',
    icon: 'Palette',
  },
];

const getDocLink = (topic: string) => {
    const t = topic.toLowerCase();
    if(t.includes('java') && !t.includes('script')) return 'https://docs.oracle.com/en/java/';
    if(t.includes('script') || t.includes('react') || t.includes('node')) return 'https://developer.mozilla.org/en-US/';
    if(t.includes('python')) return 'https://docs.python.org/3/';
    if(t.includes('c++') || t.includes('cpp')) return 'https://en.cppreference.com/w/';
    if(t.includes('go')) return 'https://go.dev/doc/';
    if(t.includes('rust')) return 'https://www.rust-lang.org/learn';
    if(t.includes('figma')) return 'https://help.figma.com/';
    if(t.includes('ui') || t.includes('ux')) return 'https://www.nngroup.com/articles/';
    return `https://www.google.com/search?q=${topic}+documentation`;
};

const generateQuiz = (subject: string): any[] => {
  // Define 12 robust questions with clear correct answers
  const rawQuestions = [
    {
      q: `What is the primary role of ${subject} in development?`,
      opts: ['Data Processing', 'Visual Styling', 'System Architecture', 'User Testing'],
      correct: 'Data Processing'
    },
    {
      q: `Which feature is most distinct in ${subject}?`,
      opts: ['Strong Typing', 'Garbage Collection', 'Hot Reloading', 'Component Scope'],
      correct: 'Strong Typing'
    },
    {
      q: `How does ${subject} handle memory allocation?`,
      opts: ['Manually', 'Automatic GC', 'Reference Counting', 'Stack Only'],
      correct: 'Automatic GC'
    },
    {
      q: `What is the standard file extension for ${subject}?`,
      opts: [`.${subject.substring(0,2).toLowerCase()}`, '.txt', '.exe', '.bin'],
      correct: `.${subject.substring(0,2).toLowerCase()}`
    },
    {
      q: `Which paradigm does ${subject} primarily follow?`,
      opts: ['Object-Oriented', 'Functional', 'Imperative', 'Logic-based'],
      correct: 'Object-Oriented'
    },
    {
      q: `What is the entry point in a standard ${subject} application?`,
      opts: ['main()', 'index.html', 'app.js', 'start()'],
      correct: 'main()'
    },
    {
      q: `Which of these is a popular library/framework for ${subject}?`,
      opts: ['Spring', 'React', 'Django', 'Laravel'],
      correct: 'Spring' // Generic placeholder, shuffled anyway
    },
    {
      q: `How do you declare a constant in ${subject}?`,
      opts: ['const', 'final', 'static', 'let'],
      correct: 'const'
    },
    {
      q: `What complexity is a binary search in ${subject}?`,
      opts: ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'],
      correct: 'O(log n)'
    },
    {
      q: `Which tool is used for dependency management in ${subject}?`,
      opts: ['NPM/Yarn', 'Maven', 'Pip', 'Cargo'],
      correct: 'NPM/Yarn'
    },
    {
      q: `What does the 'this' keyword refer to in ${subject}?`,
      opts: ['Current Object', 'Global Scope', 'Previous Function', 'None of these'],
      correct: 'Current Object'
    },
    {
      q: `How are exceptions handled in ${subject}?`,
      opts: ['Try-Catch', 'If-Else', 'Switch', 'Do-While'],
      correct: 'Try-Catch'
    }
  ];

  // Map to format and ensure randomization while tracking correct answer
  return rawQuestions.map((item, i) => {
    // Shuffle options
    const shuffledOptions = [...item.opts].sort(() => Math.random() - 0.5);
    // Find where the correct answer moved to
    // If the correct answer generic placeholder doesn't match exactly (due to generic logic above), pick index 0 as "correct" for mock purposes 
    // BUT for better realism, we try to match. If not found, default to 0.
    let correctIndex = shuffledOptions.indexOf(item.correct);
    if (correctIndex === -1) correctIndex = 0; 

    return {
      id: i + 1,
      question: item.q,
      options: shuffledOptions,
      correctAnswer: correctIndex,
    };
  });
};

const generateRichContent = (topic: string, categoryId: string) => {
    const sections = [
        { title: "1. Introduction & Origins", icon: "🚀", delay: 0 },
        { title: "2. Environment Setup", icon: "⚙️", delay: 100 },
        { title: "3. Core Syntax & Variables", icon: "📝", delay: 200 },
        { title: "4. Control Flow Logic", icon: "🔀", delay: 300 },
        { title: "5. Functions & Modularity", icon: "📦", delay: 400 },
        { title: "6. Data Structures", icon: "📊", delay: 500 },
        { title: "7. Advanced Patterns", icon: "🧠", delay: 600 },
        { title: "8. Best Practices & Optimization", icon: "✨", delay: 700 },
    ];

    const link = getDocLink(topic);

    return `
      <div class="space-y-8">
        <div class="p-8 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primaryLight rounded-r-3xl mb-12 animate-fade-in shadow-lg">
            <h1 class="text-4xl font-display font-bold text-textMain mb-3">Mastering ${topic}</h1>
            <p class="text-textMuted text-xl leading-relaxed">A comprehensive 8-module journey to becoming proficient in ${topic}. Each section below is designed to build your expertise step-by-step.</p>
        </div>

        <div class="grid gap-8">
        ${sections.map((sec, i) => `
            <div class="group relative bg-glass border border-white/10 rounded-3xl p-8 hover:bg-glass-hover hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style="animation-delay: ${sec.delay}ms">
                <!-- Decorative number background -->
                <div class="absolute -right-4 -top-4 text-9xl font-bold text-white/5 group-hover:text-primary/10 transition-colors pointer-events-none select-none z-0">
                  ${i + 1}
                </div>

                <div class="relative z-10">
                  <div class="flex items-center gap-5 mb-6">
                      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xl backdrop-blur-md">
                          ${sec.icon}
                      </div>
                      <h2 class="text-2xl md:text-3xl font-bold text-textMain group-hover:text-primaryLight transition-colors">
                          ${sec.title}
                      </h2>
                  </div>
                  
                  <div class="prose dark:prose-invert max-w-none text-textMuted text-lg leading-relaxed mb-8">
                      <p>
                          In this module, we dissect <strong>${sec.title.split('. ')[1]}</strong>. 
                          Understanding this concept is fundamental to writing clean, efficient, and scalable ${topic} code. 
                          We explore not just the "how", but the "why" behind these patterns.
                      </p>
                      <ul class="list-none pl-0 space-y-2 mt-4">
                        <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primaryLight"></span> Theoretical foundations</li>
                        <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primaryLight"></span> Practical implementation strategies</li>
                        <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primaryLight"></span> Common industry use-cases</li>
                      </ul>
                  </div>

                  <div class="bg-[#0f1623] rounded-xl p-5 border border-white/10 font-mono text-sm text-blue-300 mb-6 overflow-x-auto shadow-inner group-hover:border-primary/20 transition-colors">
                      <div class="flex gap-2 mb-3 opacity-50">
                          <div class="w-3 h-3 rounded-full bg-red-500"></div>
                          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div class="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <code>
  // ${topic} - ${sec.title.split('. ')[1]}
  function learnModule() {
    const status = "Mastering ${sec.title}";
    return {
      progress: "100%",
      certified: true
    };
  }
                      </code>
                  </div>

                  <div class="flex items-center justify-between border-t border-white/10 pt-6">
                    <span class="text-xs font-bold text-textMuted uppercase tracking-widest">Module ${i + 1} of 8</span>
                    <a href="${link}" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-primary/20 text-sm font-bold text-primaryLight hover:text-white transition-all group-hover:translate-x-1">
                        Official Docs <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  </div>
                </div>
            </div>
        `).join('')}
        </div>
        
        <div class="p-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl text-center mt-12 animate-fade-in-up border border-white/10" style="animation-delay: 900ms">
            <div class="inline-block p-4 rounded-full bg-white/10 mb-4 animate-bounce">
              <span class="text-4xl">🎓</span>
            </div>
            <h3 class="text-3xl font-display font-bold text-white mb-4">Ready to certify your skills?</h3>
            <p class="text-textMuted text-lg mb-0 max-w-2xl mx-auto">You've reviewed all 8 modules. Take the comprehensive 12-question quiz below to verify your mastery and earn your certificate.</p>
        </div>
      </div>
    `;
};

const PROG_LANGS = [
  'JavaScript', 'Python', 'Java', 'C', 'C++', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'PHP'
];

const DSA_TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Recursion', 'Dynamic Programming', 'Greedy Algorithms'
];

const DESIGN_TOPICS = [
  'UI Design', 'UX Fundamentals', 'Figma Basics', 'Color Theory', 'Typography', 'Design Systems', 'Accessibility', 'Responsive Design', 'Motion Design', 'Portfolio Design'
];

const createCourses = (topics: string[], categoryId: string): Course[] => {
  return topics.map((topic, index) => ({
    id: topic.toLowerCase().replace(/\s+/g, '-'),
    categoryId,
    title: topic,
    description: `Master ${topic} with our comprehensive 8-module mastery path.`,
    icon: 'BookOpen',
    duration: `${8 + (index % 5)} Hours`,
    level: index < 3 ? 'Beginner' : index < 7 ? 'Intermediate' : 'Advanced',
    content: generateRichContent(topic, categoryId),
    resources: [
      { title: `Official ${topic} Documentation`, url: getDocLink(topic) },
      { title: `${topic} Style Guide`, url: '#' },
      { title: 'Community Cheat Sheet', url: '#' },
    ],
    quiz: generateQuiz(topic),
  }));
};

export const COURSES: Course[] = [
  ...createCourses(PROG_LANGS, 'programming'),
  ...createCourses(DSA_TOPICS, 'dsa'),
  ...createCourses(DESIGN_TOPICS, 'design'),
];

// --- CAREER MODE DATA ---

const generateQuestionsForCompany = (companyId: string, focus: string[]): InterviewQuestion[] => {
  const diffs: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Easy', 'Medium', 'Medium', 'Medium', 'Medium', 'Hard', 'Hard', 'Hard', 'Hard'];
  
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `${companyId}-q${i + 1}`,
    title: i % 2 === 0 
      ? `Solve this ${focus[0]} problem: Invert a Binary Tree` 
      : `Explain ${focus[1]} concepts in a real-world scenario`,
    difficulty: diffs[i],
    tags: [focus[0], focus[1] || 'General'],
    answer: `
      <p><strong>Approach:</strong></p>
      <p>To solve this problem effectively, you should start by clarifying constraints. Then, propose a brute force solution followed by an optimized approach using hash maps or two pointers.</p>
      <p><strong>Key Takeaways:</strong></p>
      <ul><li>Time Complexity: O(n)</li><li>Space Complexity: O(1)</li></ul>
    `,
    resourceLink: 'https://leetcode.com',
  }));
};

const COMPANY_LIST = [
  { name: 'Google', focus: ['Graph Algorithms', 'System Design'] },
  { name: 'Microsoft', focus: ['Arrays & Strings', 'OOP Design'] },
  { name: 'Amazon', focus: ['Leadership Principles', 'Trees'] },
  { name: 'Meta', focus: ['Recursion', 'Product Design'] },
  { name: 'Apple', focus: ['Hardware/OS', 'Linked Lists'] },
  { name: 'Netflix', focus: ['Concurrency', 'System Design'] },
  { name: 'Uber', focus: ['Real-time Systems', 'Graphs'] },
  { name: 'Adobe', focus: ['Computational Geometry', 'C++'] },
  { name: 'Salesforce', focus: ['Database Design', 'Java'] },
  { name: 'Atlassian', focus: ['System Design', 'Hash Maps'] },
  { name: 'Airbnb', focus: ['Dynamic Programming', 'Experience Design'] },
  { name: 'Spotify', focus: ['Streaming Architecture', 'Mobile'] },
  { name: 'Tesla', focus: ['Embedded Systems', 'C/C++'] },
  { name: 'Twitter (X)', focus: ['Distributed Systems', 'Scala'] }, 
  { name: 'LinkedIn', focus: ['Social Graphs', 'Big Data'] },
  { name: 'Oracle', focus: ['Database Internals', 'Cloud'] },
  { name: 'IBM', focus: ['Mainframe/Legacy', 'AI'] },
  { name: 'Intel', focus: ['Low-level optimization', 'Hardware'] },
  { name: 'Nvidia', focus: ['GPU Architecture', 'Parallel Computing'] },
  { name: 'Palantir', focus: ['Data Processing', 'Algorithms'] },
];

export const COMPANIES: Company[] = COMPANY_LIST.map(c => ({
  id: c.name.toLowerCase().replace(/\s+/g, '-'),
  name: c.name,
  // Reliable mock logos using UI Avatars
  logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&rounded=true&bold=true&size=128`, 
  description: `Prepare for ${c.name} with curated questions focusing on ${c.focus.join(' and ')}.`,
  roles: ['SDE I', 'SDE II', 'Frontend', 'Backend'],
  difficulty: Math.random() > 0.5 ? 'Very Hard' : Math.random() > 0.5 ? 'Hard' : 'Moderate',
  focus: c.focus,
  questions: generateQuestionsForCompany(c.name.toLowerCase().replace(/\s+/g, '-'), c.focus),
}));