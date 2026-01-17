<script lang="ts">
    import "../../../lib/style/curriculum.css"
    import {goto} from "$app/navigation";
    let activeLevel = 'beginner';

    const levels = [
        { id: 'beginner', name: 'Beginner' },
        // { id: 'intermediate', name: 'Intermediate'},
        // { id: 'advanced', name: 'Advanced'}
    ];

    const curriculum = {
        beginner: {
            title: 'Beginner Level',
            subtitle: 'Build your foundation in Japanese',
            duration: '3-6 months',
            modules: [
                {
                    number: '01',
                    title: 'Hiragana Mastery',
                    lessons: 12,
                    duration: '2 weeks',
                    topics: ['46 Basic Characters', 'Stroke Order', 'Reading Practice', 'Writing Exercises'],
                    color: '#dc2626'
                },
                {
                    number: '02',
                    title: 'Katakana Mastery',
                    lessons: 12,
                    duration: '2 weeks',
                    topics: ['46 Basic Characters', 'Foreign Words', 'Modern Usage', 'Practice Drills'],
                    color: '#f97316'
                },
                {
                    number: '03',
                    title: 'Basic Grammar',
                    lessons: 24,
                    duration: '6 weeks',
                    topics: ['Particles (は, が, を)', 'Verb Conjugation', 'Adjectives', 'Sentence Structure'],
                    color: '#ec4899'
                },
                {
                    number: '04',
                    title: 'Essential Vocabulary',
                    lessons: 20,
                    duration: '4 weeks',
                    topics: ['Numbers & Counting', 'Daily Expressions', 'Common Verbs', 'Basic Nouns'],
                    color: '#8b5cf6'
                },
                {
                    number: '05',
                    title: 'Introduction to Kanji',
                    lessons: 30,
                    duration: '8 weeks',
                    topics: ['JLPT N5 Kanji (80)', 'Radicals', 'Readings', 'Mnemonics'],
                    color: '#0ea5e9'
                }
            ]
        },
        // intermediate: {
        //     title: 'Intermediate Level',
        //     subtitle: 'Expand your Japanese skills',
        //     duration: '6-12 months',
        //     modules: [
        //         {
        //             number: '01',
        //             title: 'Advanced Grammar',
        //             lessons: 36,
        //             duration: '10 weeks',
        //             topics: ['Complex Particles', 'Keigo (Honorifics)', 'Conditional Forms', 'Passive & Causative'],
        //             color: '#dc2626'
        //         },
        //         {
        //             number: '02',
        //             title: 'JLPT N4/N3 Kanji',
        //             lessons: 48,
        //             duration: '12 weeks',
        //             topics: ['300+ New Kanji', 'Compound Words', 'Multiple Readings', 'Context Usage'],
        //             color: '#f97316'
        //         },
        //         {
        //             number: '03',
        //             title: 'Conversational Skills',
        //             lessons: 28,
        //             duration: '8 weeks',
        //             topics: ['Natural Expressions', 'Casual vs Formal', 'Listening Practice', 'Pronunciation'],
        //             color: '#ec4899'
        //         },
        //         {
        //             number: '04',
        //             title: 'Reading Comprehension',
        //             lessons: 32,
        //             duration: '10 weeks',
        //             topics: ['Short Stories', 'News Articles', 'Manga & Comics', 'Cultural Texts'],
        //             color: '#8b5cf6'
        //         },
        //         {
        //             number: '05',
        //             title: 'Writing Practice',
        //             lessons: 24,
        //             duration: '8 weeks',
        //             topics: ['Essay Structure', 'Formal Letters', 'Creative Writing', 'Composition Tips'],
        //             color: '#0ea5e9'
        //         }
        //     ]
        // },
        // advanced: {
        //     title: 'Advanced Level',
        //     subtitle: 'Achieve Japanese mastery',
        //     duration: '12+ months',
        //     modules: [
        //         {
        //             number: '01',
        //             title: 'JLPT N2/N1 Kanji',
        //             lessons: 60,
        //             duration: '16 weeks',
        //             topics: ['1000+ Advanced Kanji', 'Literary Usage', 'Technical Terms', 'Classical References'],
        //             color: '#dc2626'
        //         },
        //         {
        //             number: '02',
        //             title: 'Business Japanese',
        //             lessons: 40,
        //             duration: '12 weeks',
        //             topics: ['Keigo Mastery', 'Email Writing', 'Presentations', 'Negotiations'],
        //             color: '#f97316'
        //         },
        //         {
        //             number: '03',
        //             title: 'Advanced Reading',
        //             lessons: 36,
        //             duration: '10 weeks',
        //             topics: ['Novels', 'Academic Papers', 'Technical Documents', 'Classical Literature'],
        //             color: '#ec4899'
        //         },
        //         {
        //             number: '04',
        //             title: 'Native-Level Speaking',
        //             lessons: 32,
        //             duration: '10 weeks',
        //             topics: ['Dialects', 'Idioms & Slang', 'Debate Skills', 'Natural Flow'],
        //             color: '#8b5cf6'
        //         },
        //         {
        //             number: '05',
        //             title: 'Cultural Mastery',
        //             lessons: 28,
        //             duration: '8 weeks',
        //             topics: ['History & Traditions', 'Social Etiquette', 'Pop Culture', 'Regional Differences'],
        //             color: '#0ea5e9'
        //         }
        //     ]
        // }
    };

    $: currentCurriculum = curriculum[activeLevel]
</script>

<!-- Level Selector -->
<section class="level-selector">
    <div class="container">
        <div class="level-tabs">
            {#each levels as level}
                <button
                        class="level-tab"
                        class:active={activeLevel === level.id}
                        onclick={() => activeLevel = level.id}
                >
                    <span class="tab-name">{level.name}</span>
                </button>
            {/each}
        </div>
    </div>
</section>

<div class="curriculum-page">
    <!-- Hero Section -->
    <section class="curriculum-hero">
        <div class="hero-content">
<!--            <div class="badge">-->
<!--                <span class="badge-icon">📖</span>-->
<!--                <span>Complete Curriculum</span>-->
<!--            </div>-->
            <h1 class="hero-title">
                Master Japanese
                <span class="gradient-text">Step by Step</span>
            </h1>
            <p class="hero-description">
                Our comprehensive curriculum takes you from complete beginner to advanced fluency with structured lessons,
                interactive exercises, and cultural insights at every level.
            </p>
        </div>
    </section>

    <!-- Curriculum Content -->
    <section class="curriculum-content">
        <div class="container">
            <div class="content-header">
                <h2 class="content-title">{currentCurriculum.title}</h2>
                <p class="content-subtitle">{currentCurriculum.subtitle}</p>
                <div class="duration-badge">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M8 4V8L11 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span>Estimated Duration: {currentCurriculum.duration}</span>
                </div>
            </div>

            <div class="modules-grid">
                {#each currentCurriculum.modules as module}
                    <div class="module-card">
                        <div class="module-header" style="--module-color: {module.color}">
                            <div class="module-number">{module.number}</div>
                            <div class="module-info">
                                <h3 class="module-title">{module.title}</h3>
                                <div class="module-meta">
                  <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L9 5L13 5.5L10 8.5L11 13L7 11L3 13L4 8.5L1 5.5L5 5L7 1Z" fill="currentColor"/>
                    </svg>
                      {module.lessons} Lessons
                  </span>
                                    <span class="meta-divider">•</span>
                                    <span class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/>
                      <path d="M7 3V7L10 9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                                        {module.duration}
                  </span>
                                </div>
                            </div>
                        </div>
                        <div class="module-topics">
                            <h4 class="topics-title">What you'll learn:</h4>
                            <ul class="topics-list">
                                {#each module.topics as topic}
                                    <li class="topic-item">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        {topic}
                                    </li>
                                {/each}
                            </ul>
                        </div>
<!--                        <button class="module-btn">-->
<!--                            Start Module-->
<!--                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">-->
<!--                                <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--                            </svg>-->
<!--                        </button>-->
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <h2 class="features-title">Why Our Curriculum Works</h2>
            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-icon">🎯</div>
                    <h3 class="feature-title">Structured Learning</h3>
                    <p class="feature-text">Follow a proven path from basics to advanced, with clear milestones and progress tracking.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🧠</div>
                    <h3 class="feature-title">Spaced Repetition</h3>
                    <p class="feature-text">Our system uses proven SRS algorithms to optimize retention and long-term memory.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎮</div>
                    <h3 class="feature-title">Interactive Practice</h3>
                    <p class="feature-text">Engage with quizzes, games, and real-world scenarios to reinforce your learning.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📊</div>
                    <h3 class="feature-title">Progress Analytics</h3>
                    <p class="feature-text">Track your improvement with detailed stats and personalized recommendations.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2 class="cta-title">Ready to Begin Your Journey?</h2>
                <p class="cta-text">Start with our beginner course and work your way to fluency</p>
                <div class="cta-buttons">
                    <button class="btn btn-primary" onclick={() => goto("/sign-up")}>
                        Start Learning Now
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>
</div>