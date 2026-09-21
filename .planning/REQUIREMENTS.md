# ExamPilot v1.0 — Requirements

## Functional Requirements

### FR-01: Critical Stability (P0)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-01.1 | Timer persists across refresh/tab close | `timeLeft`, `currentIndex`, `selectedAnswers` saved to `sessionStorage` every 10s; restored on mount |
| FR-01.2 | Error boundaries prevent app crash | `<ErrorBoundary>` wraps each top-level page; fallback shows "Something went wrong" + retry |
| FR-01.3 | Auth race condition resolved | `localStorage` cache has version stamp; stale cache rejected |
| FR-01.4 | CSP headers deployed | `Content-Security-Policy` header present; no inline script violations |
| FR-01.5 | Git repo initialized with baseline commit | `git init` + `.gitignore` + commit `chore: baseline` |

### FR-02: Subject Bank & Practice (P1)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-02.1 | Unified subject selector | Single `<SubjectBankSelect>` component using `SUBJECT_GROUPS` taxonomy; appears in MockTestPage, McqPracticePage, PyqArchivePage |
| FR-02.2 | Zero subject leakage | `getQuestionsBySubjectGroup(groupId)` returns ONLY questions with exact subject match; verified by automated test |
| FR-02.3 | Chapter → Topic → Subtopic drill | SyllabusExplorer hierarchy (`topicKnowledge.ts`) linked from practice; breadcrumb nav |
| FR-02.4 | Keyboard shortcuts in test | A/B/C/D = select; Space = next; Shift+Space = prev; F = flag; Esc = pause |

### FR-03: Mistake Notebook / Error Log (P1 — Killer Feature)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-03.1 | Auto-capture wrong answers | Every mock/practice submission logs `{questionId, userAnswer, correctAnswer, timestamp, subjectGroup, topic}` to `mistake_log` |
| FR-03.2 | Review Mistakes queue | Dedicated tab "Review Mistakes" with SRS (SM-2) scheduling; shows question + explanation + "Why I got it wrong" note field |
| FR-03.3 | Mistake analytics | Dashboard: "Top 5 weak topics", "Repeated mistakes", "Mistakes by subject group" |

### FR-04: Full Exam Simulation (P1 — Killer Feature)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-04.1 | Locked timer mode | Timer cannot be paused; browser close warning; auto-submit at 0:00 |
| FR-04.2 | OMR sheet export | PDF download with bubbles filled per answer key |
| FR-04.3 | Section-wise navigation | Left sidebar shows all sections; click to jump; visual progress per section |
| FR-04.4 | Exam-day UI | Full-screen, no header/footer, high contrast, minimal chrome |

### FR-05: Spaced Repetition (P1)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-05.1 | SM-2 algorithm on practice attempts | `recordPracticeAttempt` updates `easeFactor`, `interval`, `dueDate` per question |
| FR-05.2 | "Revise Weak Areas" in Study Plan | Daily goals auto-include due SRS cards; max 10/day |
| FR-05.3 | SRS stats visible | "Due today: N", "Avg ease factor: X" in ProgressAnalytics |

### FR-06: PWA / Offline-First (P1)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-06.1 | Service Worker precaches question banks | `vite-plugin-pwa` configured; `ALL_QUESTIONS` + `GENERAL_STUDIES_QUESTIONS` cached |
| FR-06.2 | Background sync for submissions | Failed `submitMockTest` queued in IndexedDB; retries on online |
| FR-06.3 | Install prompt | Meets PWA criteria; "Add to Home Screen" works |

### FR-07: Accessibility (P1)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-07.1 | WCAG 2.1 AA baseline | axe-core audit: 0 critical, ≤5 minor |
| FR-07.2 | Skip link + ARIA live timer | `<a href="#main" class="skip-link">Skip to content</a>`; timer announced via `aria-live="polite"` |
| FR-07.3 | Color-blind safe status badges | All status chips have icon + text, not color-only |
| FR-07.4 | Focus management in modals | `useFocusTrap` used consistently; `Dialog` component uses `<dialog>` |

### FR-08: Performance & Architecture (P2)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-08.1 | Code splitting by route | `React.lazy` + `Suspense` for Admin, AI Studio, Knowledge Hub, Syllabus |
| FR-08.2 | Bundle size < 500KB gzipped | `vite-bundle-analyzer` report; lazy chunks < 100KB each |
| FR-08.3 | Zustand store for global state | Auth, mocks, questions, practice state unified; no prop drilling >2 levels |
| FR-08.4 | QuestionRepository interface | `LocalStorageImpl` / `FirestoreImpl` swap; tests against interface |

### FR-09: Admin → Student Pipeline (P2)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-09.1 | Paper ingestor → PYQ Archive | Admin uploads PDF → OCR → review → "Publish" → appears in student PYQ Archive |
| FR-09.2 | AI mock approval | Admin generates mock → reviews → "Approve" → appears in student MockTestPage |
| FR-09.3 | Versioning | Each paper/mock has `version`, `publishedAt`, `publishedBy` |

### FR-10: Analytics & Percentiles (P2)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-10.1 | Trend charts | Recharts line charts: accuracy over time, speed over time, readiness over time |
| FR-10.2 | Peer percentile (mock) | If ≥50 submissions for same mock, show "You scored better than X%" |
| FR-10.3 | Time-per-question heatmap | Grid: question # vs time spent; color = accuracy |

---

## Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Lighthouse Performance | ≥90 |
| NFR-02 | Lighthouse Accessibility | ≥95 |
| NFR-03 | Lighthouse Best Practices | ≥90 |
| NFR-04 | Lighthouse SEO | ≥90 |
| NFR-05 | First Contentful Paint | <1.5s |
| NFR-06 | Time to Interactive | <3s |
| NFR-07 | Service Worker install time | <2s |
| NFR-08 | Test coverage (services) | ≥70% |
| NFR-09 | Zero critical axe violations | 0 |
| NFR-10 | No `any` in new code | 0 |

---

## Out of Scope (v1.0)
- Community / discussion forum
- Voice input for AI Tutor
- Peer percentile (requires backend aggregation)
- Cutoff predictor (requires historical data)
- Multi-language support
- Native mobile app