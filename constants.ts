import { LayoutDashboard, BookOpen, Briefcase, Award, Settings } from 'lucide-react';
import { Category, Course, Company, InterviewQuestion, FAQItem, BadgeDefinition } from './types';
import { getDailyCodeSnippet } from './utils/dailyCodeGenerator';

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

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Is SkillVerse really free to use?',
    answer: "Yes — the Starter plan gives you free access to basic courses, quizzes, and mobile access, forever. A paid Pro plan is available if you want unlimited courses, verified certificates, unlimited AI tutoring, and Career Mode access."
  },
  {
    id: 'faq-2',
    question: 'What subjects can I learn on SkillVerse?',
    answer: "Programming, Data Structures & Algorithms (DSA), and Design — with more categories planned as the platform grows."
  },
  {
    id: 'faq-3',
    question: 'Are the certificates actually recognized or verifiable?',
    answer: "Yes. Each certificate has a unique verification ID and can be checked independently, so you can confidently share it on LinkedIn or your resume."
  },
  {
    id: 'faq-4',
    question: 'Do I need prior coding experience to get started?',
    answer: "No — courses are structured for a range of levels, from complete beginners to more advanced learners, and you can pick your starting point during onboarding."
  },
  {
    id: 'faq-5',
    question: 'What is Career Mode?',
    answer: "A dedicated interview-prep space with real company-style questions, study mode, and mock interviews (including an AI voice interview option) to help you prepare for actual job interviews."
  },
  {
    id: 'faq-6',
    question: 'Is my progress saved if I come back later?',
    answer: "Yes, your course progress, quiz scores, and Career Mode activity are all saved to your account so you can pick up right where you left off."
  },
  {
    id: 'faq-7',
    question: "What's the AI Assistant, and is it available to free users?",
    answer: "It's a built-in AI tutor that explains concepts and answers questions as you learn. Free users get limited access; Pro users get unlimited access."
  },
  {
    id: 'faq-8',
    question: 'How does XP and leveling work?',
    answer: "You earn XP for completing quizzes, practicing interview questions, and maintaining daily learning streaks — leveling up as you go to track your overall progress and stay motivated."
  },
  {
    id: 'faq-9',
    question: 'Can I use SkillVerse on my phone?',
    answer: "Yes, the platform is fully accessible on mobile browsers alongside desktop."
  },
  {
    id: 'faq-10',
    question: 'Is my personal data safe?',
    answer: "Yes — SkillVerse doesn't sell or share your learning data with third parties, and you have control to manage or reset your data from your account settings."
  },
];

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first course',
    icon: 'Footprints',
  },
  {
    id: 'certified',
    name: 'Certified',
    description: 'Earn your first certificate',
    icon: 'Award',
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Reach a 3-day streak',
    icon: 'Flame',
  },
  {
    id: 'interview-ready',
    name: 'Interview Ready',
    description: 'Complete a mock interview',
    icon: 'Briefcase',
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

const MODULE_SECTIONS = [
  { title: "1. Introduction & Origins", icon: "🚀" },
  { title: "2. Environment Setup", icon: "⚙️" },
  { title: "3. Core Syntax & Variables", icon: "📝" },
  { title: "4. Control Flow Logic", icon: "🔀" },
  { title: "5. Functions & Modularity", icon: "📦" },
  { title: "6. Data Structures", icon: "📊" },
  { title: "7. Advanced Patterns", icon: "🧠" },
  { title: "8. Best Practices & Optimization", icon: "✨" },
];

const generateSectionHtml = (sec: { title: string; icon: string }, i: number, topic: string): string => {
  const link = getDocLink(topic);
  const dailySnippet = getDailyCodeSnippet(topic, i);
  const titleClean = sec.title.includes('. ') ? sec.title.split('. ')[1] : sec.title;

  return '<div id="module-' + (i + 1) + '" class="bg-glass hover:bg-glass-hover border border-black/20 dark:border-white/10 rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-xl relative overflow-hidden group hover:border-primaryLight/40">' +
    '<div class="absolute -right-4 -bottom-4 text-9xl font-display font-bold text-white/5 pointer-events-none select-none">' + (i + 1) + '</div>' +
    '<div class="relative z-10">' +
      '<div class="flex items-center gap-5 mb-6">' +
        '<div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xl backdrop-blur-md">' + sec.icon + '</div>' +
        '<h2 class="text-2xl md:text-3xl font-bold text-textMain group-hover:text-primaryLight transition-colors">' + sec.title + '</h2>' +
      '</div>' +
      '<div class="prose dark:prose-invert max-w-none text-textMuted text-lg leading-relaxed mb-8">' +
        '<p>In this module, we dissect <strong>' + titleClean + '</strong>. Understanding this concept is fundamental to writing clean, efficient, and scalable ' + topic + ' code.</p>' +
        '<ul class="list-none pl-0 space-y-2 mt-4">' +
          '<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primaryLight"></span> Theoretical foundations</li>' +
          '<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primaryLight"></span> Practical implementation strategies</li>' +
          '<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-primaryLight"></span> Common industry use-cases</li>' +
        '</ul>' +
      '</div>' +
      '<div class="bg-[#0f1623] rounded-xl p-5 border border-white/10 font-mono text-sm text-blue-300 mb-6 overflow-x-auto shadow-inner group-hover:border-primary/20 transition-colors">' +
        '<div class="flex gap-2 mb-3 opacity-50"><div class="w-3 h-3 rounded-full bg-red-500"></div><div class="w-3 h-3 rounded-full bg-yellow-500"></div><div class="w-3 h-3 rounded-full bg-green-500"></div></div>' +
        '<code>' + dailySnippet + '</code>' +
      '</div>' +
      '<div class="flex items-center justify-between border-t border-white/10 pt-6">' +
        '<span class="text-xs font-bold text-textMuted uppercase tracking-widest">Module ' + (i + 1) + ' of 8</span>' +
        '<a href="' + link + '" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-primary/20 text-sm font-bold text-primaryLight hover:text-white transition-all group-hover:translate-x-1">Official Docs ↗</a>' +
      '</div>' +
    '</div>' +
  '</div>';
};

const generateRichContent = (topic: string, categoryId: string): string => {
  const sectionsHtml = MODULE_SECTIONS.map((sec, i) => generateSectionHtml(sec, i, topic)).join('');

  return `
    <div class="space-y-12">
        <div class="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-white/10 rounded-3xl relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primaryLight text-xs font-bold uppercase tracking-wider mb-6 border border-primary/30">
                Mastery Path
            </div>
            <h1 class="text-4xl font-display font-bold text-textMain mb-3">Mastering ${topic}</h1>
            <p class="text-textMuted text-xl leading-relaxed">A comprehensive 8-module journey to becoming proficient in ${topic}. Each section below is designed to build your expertise step-by-step.</p>
        </div>

        <div class="grid gap-8">
          ${sectionsHtml}
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

const TOPIC_QUESTION_MAP: Record<string, string[]> = {
  'Graph Algorithms': ['Implement Dijkstra\'s Algorithm', 'Find the shortest path in a 2D grid', 'Detect a cycle in a directed graph', 'Clone a Graph', 'Course Schedule (Topological Sort)'],
  'System Design': ['Design a URL Shortener (TinyURL)', 'Design a Rate Limiter', 'Design Twitter/X Feed', 'Design a Key-Value Store', 'Design Uber/Lyft backend'],
  'Arrays & Strings': ['Two Sum', 'Longest Substring Without Repeating Characters', '3Sum', 'Container With Most Water', 'Valid Anagram'],
  'OOP Design': ['Design a Parking Lot', 'Design an Elevator System', 'Design a Deck of Cards', 'Design a Library Management System', 'Design a Vending Machine'],
  'Leadership Principles': ['Tell me about a time you showed customer obsession', 'When did you disagree and commit?', 'Describe a time you delivered results under pressure', 'How do you invent and simplify?', 'Give an example of deep diving into a problem'],
  'Trees': ['Invert a Binary Tree', 'Maximum Depth of Binary Tree', 'Serialize and Deserialize Binary Tree', 'Lowest Common Ancestor of a BST', 'Binary Tree Level Order Traversal'],
  'Recursion': ['Generate Parentheses', 'Letter Combinations of a Phone Number', 'Word Search', 'N-Queens Problem', 'Sudoku Solver'],
  'Product Design': ['Design Instagram Stories', 'Design Facebook News Feed', 'Design WhatsApp Chat', 'Design TikTok Recommendation System', 'Design Airbnb Booking'],
  'Hardware/OS': ['Explain Virtual Memory', 'How does a context switch work?', 'Design a Cache Replacement Policy (LRU)', 'Explain Mutex vs Semaphore', 'Interrupt Handling Lifecycle'],
  'Linked Lists': ['Reverse a Linked List', 'Detect Cycle in a Linked List', 'Merge k Sorted Lists', 'LRU Cache Implementation', 'Copy List with Random Pointer'],
  'Concurrency': ['Print FooBar Alternately', 'The Dining Philosophers Problem', 'Building H2O', 'Web Crawler Multithreaded', 'Thread-Safe Singleton in Java'],
  'Real-time Systems': ['Design a real-time multiplayer game server', 'Design a stock ticker system', 'Design a live video streaming platform', 'Design a collaborative text editor', 'Handle million WebSockets concurrently'],
  'Graphs': ['Number of Islands', 'Word Ladder', 'Alien Dictionary', 'Network Delay Time', 'Cheapest Flights Within K Stops'],
  'Computational Geometry': ['Find if two line segments intersect', 'Convex Hull Algorithm', 'Point in Polygon', 'Closest Pair of Points', 'Area of intersection of two circles'],
  'C++': ['Explain Virtual Functions and VTable', 'Implement shared_ptr from scratch', 'RAII principle in C++', 'Move semantics and rvalue references', 'Template Metaprogramming'],
  'Database Design': ['Design database schema for Amazon', 'SQL vs NoSQL trade-offs', 'Explain Database Normalization (1NF to 3NF)', 'Design schema for a social network', 'Handling database migrations at scale'],
  'Java': ['Explain Garbage Collection roots', 'ConcurrentHashMap internal working', 'Java Memory Model', 'CompletableFuture and ForkJoinPool', 'Spring Boot Dependency Injection'],
  'Hash Maps': ['Design HashMap', 'Group Anagrams', 'Subarray Sum Equals K', 'Insert Delete GetRandom O(1)', 'Find All Anagrams in a String'],
  'Dynamic Programming': ['Climbing Stairs', 'Coin Change', 'Longest Increasing Subsequence', 'Edit Distance', 'Regular Expression Matching'],
  'Experience Design': ['Redesign the checkout flow', 'Improve accessibility of a web app', 'Design a dashboard for analytics', 'Optimize mobile app navigation', 'A/B testing strategies'],
  'Streaming Architecture': ['Design Netflix video streaming', 'Design Spotify audio streaming', 'Handling buffering and latency', 'CDN architecture', 'Adaptive bitrate streaming'],
  'Mobile': ['iOS App Lifecycle', 'Android Activity vs Fragment', 'React Native Bridge architecture', 'Mobile offline storage sync', 'Memory management on iOS'],
  'Embedded Systems': ['Write an I2C driver', 'Handling hardware interrupts in C', 'Real-Time Operating System (RTOS) scheduling', 'Watchdog timer implementation', 'Optimizing battery life in firmware'],
  'C/C++': ['Memory alignment and padding', 'Volatile keyword', 'Implement malloc/free', 'Pointer arithmetic', 'Inline assembly'],
  'Distributed Systems': ['Paxos vs Raft consensus', 'Consistent Hashing', 'Vector Clocks', 'CAP Theorem practical application', 'Distributed Tracing'],
  'Scala': ['Pattern matching in Scala', 'Akka Actor Model', 'Immutability and side effects', 'Tail recursion', 'Implicit parameters'],
  'Social Graphs': ['Suggest friends algorithm', 'Find degree of separation between users', 'Graph database vs Relational DB', 'Calculate PageRank', 'Handling billion-node graphs'],
  'Big Data': ['MapReduce word count', 'Design a data pipeline (Kafka/Spark)', 'Lambda vs Kappa architecture', 'Data warehousing (Snowflake/Redshift)', 'Handling stream processing late data'],
  'Database Internals': ['B-Tree vs B+Tree', 'Write-Ahead Logging (WAL)', 'ACID transactions implementation', 'Multiversion Concurrency Control (MVCC)', 'Query optimizer phases'],
  'Cloud': ['AWS IAM architecture', 'Kubernetes pod lifecycle', 'Serverless cold start mitigation', 'Designing a multi-region active-active architecture', 'VPC peering and subnets'],
  'Mainframe/Legacy': ['COBOL integration strategies', 'Migrating DB2 to Cloud', 'Mainframe batch processing', 'CICS transactions', 'EBCDIC to ASCII conversion'],
  'AI': ['Design a recommendation engine', 'Deploying LLMs at scale', 'Model quantization', 'Vector database architecture', 'Handling GPU memory limits'],
  'Low-level optimization': ['SIMD instructions', 'Cache line bouncing', 'Branch prediction optimization', 'Loop unrolling', 'Data oriented design'],
  'Hardware': ['CPU pipeline stages', 'FPGA vs ASIC', 'Cache coherence protocols (MESI)', 'Memory hierarchy', 'PCIe bus architecture'],
  'GPU Architecture': ['CUDA thread blocks and grid', 'Shared memory vs Global memory', 'Warp divergence', 'Tensor Cores', 'Memory coalescing'],
  'Parallel Computing': ['Amdahl\'s Law calculation', 'Message Passing Interface (MPI)', 'OpenMP pragmas', 'Deadlock avoidance', 'Lock-free data structures'],
  'Data Processing': ['ETL pipeline design', 'Handling skewed data in Spark', 'Data lakes vs Data warehouses', 'Real-time vs Batch processing', 'Schema evolution'],
  'Algorithms': ['KMP String Matching', 'A* Search Algorithm', 'Tarjan\'s SCC', 'Kruskal vs Prim MST', 'Suffix Arrays']
};

const generateQuestionsForCompany = (companyId: string, focus: string[]): InterviewQuestion[] => {
  const diffs: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Easy', 'Medium', 'Medium', 'Medium', 'Medium', 'Hard', 'Hard', 'Hard', 'Hard'];
  
  // Mix questions from both focus tags, fallback to generic if tag missing
  const questionsList1 = TOPIC_QUESTION_MAP[focus[0]] || ['Explain core concept', 'Solve basic problem', 'Design system component', 'Optimize algorithm', 'Debug edge case'];
  const questionsList2 = TOPIC_QUESTION_MAP[focus[1]] || questionsList1;
  
  // Combine and deduplicate
  const allQuestions = Array.from(new Set([...questionsList1, ...questionsList2]));
  
  // Shuffle exactly once
  const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
  
  return Array.from({ length: 10 }).map((_, i) => {
    // Safely pick unique questions if there are enough, otherwise wrap around
    const title = shuffledQuestions[i % shuffledQuestions.length];
    return {
      id: `${companyId}-q${i + 1}`,
      title: title,
      difficulty: diffs[i],
      tags: [focus[i % 2 === 0 ? 0 : 1] || 'General'],
      answer: `
        <p><strong>Approach:</strong></p>
        <p>Start by clarifying constraints. Discuss trade-offs before writing code. For system design, draw the high-level architecture first.</p>
      `,
      resourceLink: 'https://leetcode.com',
    };
  });
};

const COMPANY_LIST = [
  { name: 'Google', focus: ['Graph Algorithms', 'System Design'], domain: 'google.com' },
  { name: 'Microsoft', focus: ['Arrays & Strings', 'OOP Design'], domain: 'microsoft.com' },
  { name: 'Amazon', focus: ['Leadership Principles', 'Trees'], domain: 'amazon.com' },
  { name: 'Meta', focus: ['Recursion', 'Product Design'], domain: 'meta.com' },
  { name: 'Apple', focus: ['Hardware/OS', 'Linked Lists'], domain: 'apple.com' },
  { name: 'Netflix', focus: ['Concurrency', 'System Design'], domain: 'netflix.com' },
  { name: 'Uber', focus: ['Real-time Systems', 'Graphs'], domain: 'uber.com' },
  { name: 'Adobe', focus: ['Computational Geometry', 'C++'], domain: 'adobe.com' },
  { name: 'Salesforce', focus: ['Database Design', 'Java'], domain: 'salesforce.com' },
  { name: 'Atlassian', focus: ['System Design', 'Hash Maps'], domain: 'atlassian.com' },
  { name: 'Airbnb', focus: ['Dynamic Programming', 'Experience Design'], domain: 'airbnb.com' },
  { name: 'Spotify', focus: ['Streaming Architecture', 'Mobile'], domain: 'spotify.com' },
  { name: 'Tesla', focus: ['Embedded Systems', 'C/C++'], domain: 'tesla.com' },
  { name: ' X (Twitter)', focus: ['Distributed Systems', 'Scala'], domain: 'x.com' }, 
  { name: 'LinkedIn', focus: ['Social Graphs', 'Big Data'], domain: 'linkedin.com' },
  { name: 'Oracle', focus: ['Database Internals', 'Cloud'], domain: 'oracle.com' },
  { name: 'IBM', focus: ['Mainframe/Legacy', 'AI'], domain: 'ibm.com' },
  { name: 'Intel', focus: ['Low-level optimization', 'Hardware'], domain: 'intel.com' },
  { name: 'Nvidia', focus: ['GPU Architecture', 'Parallel Computing'], domain: 'nvidia.com' },
  { name: 'Palantir', focus: ['Data Processing', 'Algorithms'], domain: 'palantir.com' },
];

export const COMPANIES: Company[] = COMPANY_LIST.map((c, index) => ({
  id: c.name.toLowerCase().replace(/\s+/g, '-'),
  name: c.name,
  // Reliable mock logos using UI Avatars
  logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&rounded=true&bold=true&size=128`, 
  description: `Prepare for ${c.name} with curated questions focusing on ${c.focus.join(' and ')}.`,
  roles: ['SDE I', 'SDE II', 'Frontend', 'Backend'],
  difficulty: index % 3 === 0 ? 'Very Hard' : index % 3 === 1 ? 'Hard' : 'Moderate',
  focus: c.focus,
  questions: generateQuestionsForCompany(c.name.toLowerCase().replace(/\s+/g, '-'), c.focus),
}));

export const VOICE_INTERVIEW_QUESTIONS = [
  "Tell me about a time you had to overcome a difficult technical challenge. How did you approach it?",
  "Describe a situation where you had a disagreement with a team member. How was it resolved?",
  "Where do you see yourself in your career five years from now?",
  "What is your greatest professional achievement so far?",
  "How do you handle tight deadlines and high-pressure situations?",
  "Tell me about a time you had to learn a new technology or concept very quickly.",
  "Why are you interested in working for our company specifically?",
  "Describe your ideal work environment and team culture.",
  "Tell me about a time you made a mistake at work. What did you learn from it?",
  "How do you prioritize your tasks when you have multiple urgent deadlines?"
];

export interface XPStoreTheme {
  id: string;
  name: string;
  cost: number;
  description: string;
  primary: string;
  primaryLight: string;
  themeMode: 'dark' | 'light';
}

export interface XPStoreCursor {
  id: string;
  name: string;
  cost: number;
  description: string;
  dotClass: string;
  ringClass: string;
}

export interface XPStoreFrame {
  id: string;
  name: string;
  cost: number;
  description: string;
  frameClass: string;
}

export const XP_STORE_THEMES: XPStoreTheme[] = [
  {
    id: 'dark',
    name: 'Default Dark',
    cost: 0,
    description: 'The standard dark theme of SkillVerse.',
    primary: '105 104 166', // #6968A6
    primaryLight: '207 152 147', // #CF9893
    themeMode: 'dark',
  },
  {
    id: 'light',
    name: 'Default Light',
    cost: 0,
    description: 'The standard light theme of SkillVerse.',
    primary: '105 104 166',
    primaryLight: '207 152 147',
    themeMode: 'light',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    cost: 300,
    description: 'A soothing green theme inspired by lush woodlands.',
    primary: '16 185 129', // #10B981
    primaryLight: '110 231 183', // #6EE7B7
    themeMode: 'dark',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    cost: 500,
    description: 'Futuristic vibes with high-contrast violet and neon yellow.',
    primary: '139 92 246', // #8B5CF6
    primaryLight: '245 158 11', // #F59E0B
    themeMode: 'dark',
  },
  {
    id: 'oceanic',
    name: 'Deep Oceanic',
    cost: 400,
    description: 'Calming blues reminiscent of deep underwater trenches.',
    primary: '14 165 233', // #0EA5E9
    primaryLight: '56 189 248', // #38BDF8
    themeMode: 'dark',
  }
];

export const XP_STORE_CURSORS: XPStoreCursor[] = [
  {
    id: 'default',
    name: 'Classic Dot',
    cost: 0,
    description: 'The classic primary-colored custom dot and ring cursor.',
    dotClass: 'bg-primaryLight',
    ringClass: 'border-primary',
  },
  {
    id: 'neon-emerald',
    name: 'Neon Emerald',
    cost: 200,
    description: 'Bright green cursor with a glowing ring.',
    dotClass: 'bg-emerald-400',
    ringClass: 'border-emerald-400',
  },
  {
    id: 'ruby-laser',
    name: 'Ruby Laser',
    cost: 300,
    description: 'Deep red high-precision dot and laser outer ring.',
    dotClass: 'bg-rose-500',
    ringClass: 'border-rose-500',
  },
  {
    id: 'cyber-gold',
    name: 'Cyber Gold',
    cost: 450,
    description: 'Gleaming gold cursor for elite learners.',
    dotClass: 'bg-amber-400',
    ringClass: 'border-amber-400',
  }
];

export const XP_STORE_FRAMES: XPStoreFrame[] = [
  {
    id: 'none',
    name: 'No Frame',
    cost: 0,
    description: 'No avatar frame selected.',
    frameClass: '',
  },
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    cost: 150,
    description: 'A vibrant pulsing neon frame for a modern tech look.',
    frameClass: 'ring-[3px] ring-purple-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.7)]',
  },
  {
    id: 'gold-shimmer',
    name: 'Gold Shimmer',
    cost: 300,
    description: 'A luxurious shining gold frame for outstanding achievements.',
    frameClass: 'ring-[3px] ring-amber-400 animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.8)]',
  },
  {
    id: 'cyberpunk-grid',
    name: 'Cyberpunk Grid',
    cost: 450,
    description: 'A futuristic digital grid with glowing cyber hues.',
    frameClass: 'ring-[3px] ring-cyan-400 border-[2px] border-pink-500 shadow-[0_0_12px_rgba(6,182,212,0.7)]',
  },
  {
    id: 'emerald-aura',
    name: 'Emerald Aura',
    cost: 200,
    description: 'A soothing mystical green glow surrounding your avatar.',
    frameClass: 'ring-[3px] ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.7)]',
  }
];

export const TOUR_STEPS = [
  {
    id: 'overview',
    title: "Welcome to SkillVerse",
    description: "Your all-in-one platform to master coding, design, and interview skills.",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Track daily progress & streaks",
      "Visualize your learning curve",
      "Earn XP and level up"
    ],
    imageUrl: "/assets/tour/tour_overview_1783097943357.png"
  },
  {
    id: 'courses',
    title: "Structured Courses",
    description: "Dive into comprehensive modules designed by industry experts.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    features: [
      "Interactive coding notes",
      "Built-in AI Tutor support",
      "Quizzes to test knowledge"
    ],
    imageUrl: "/assets/tour/tour_courses_1783097954059.png"
  },
  {
    id: 'career',
    title: "Career Mode",
    description: "Prepare for your dream job with real-world simulations.",
    icon: Briefcase,
    color: "from-emerald-500 to-green-500",
    features: [
      "Mock Interview Simulator",
      "Company-specific questions",
      "Readiness Score tracking"
    ],
    imageUrl: "/assets/tour/tour_career_1783097968924.png"
  },
  {
    id: 'certifications',
    title: "Get Certified",
    description: "Prove your mastery with verifiable credentials.",
    icon: Award,
    color: "from-yellow-400 to-orange-500",
    features: [
      "Pass final exams (70%+)",
      "Download PDF certificates",
      "Share directly to LinkedIn"
    ],
    imageUrl: "/assets/tour/tour_certs_1783097979805.png"
  },
  {
    id: 'settings',
    title: "Customize Everything",
    description: "Make the learning experience truly yours.",
    icon: Settings,
    color: "from-gray-400 to-slate-400",
    features: [
      "Dark/Light themes",
      "Custom avatars",
      "Learning goal settings"
    ],
    imageUrl: "/assets/tour/tour_settings_1783097991800.png"
  }
];