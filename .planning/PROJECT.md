# ExamPilot — Project Charter

## Project Identity
- **Name**: ExamPilot
- **Tagline**: Civil Engineering Exam Preparation Platform
- **Vision**: Best-in-class aspirant experience for APSC/UPSC/State PSC civil engineering exams
- **Status**: Brownfield — active codebase, ~200 PYQs, AI mock generation, syllabus explorer

## Milestone
- **Name**: v1.0 — Production Hardening & Aspirant Experience
- **Target**: 2026-10-31
- **Theme**: Fix critical bugs, eliminate UX friction, deliver 3 killer aspirant features

## Success Metrics
| Metric | Current | Target v1.0 |
|--------|---------|-------------|
| Build passes | ✅ | ✅ |
| Timer survives refresh | ❌ | ✅ |
| Subject-bank zero leakage | ⚠️ partial | ✅ |
| Error Log / Mistake Notebook | ❌ | ✅ |
| Full Exam Simulation | ❌ | ✅ |
| PWA offline-first | ❌ | ✅ |
| Accessibility (WCAG 2.1 AA) | ~40% | ✅ |
| Test coverage (services) | 0% | ≥70% |

## Team / Roles
- **Solo developer** (you) — full stack, AI, UX
- **AI assistants** — code gen, research, review

## Constraints
- No git repo yet (init at P0)
- Firebase config exists but rules not audited
- Gemini API key client-side (needs proxy)
- Single developer → phases must be vertically shippable

## Risk Register
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep on AI features | High | Medium | Freeze AI scope after Phase 2 |
| Firebase security rules | Medium | High | Audit in Phase 1 |
| Bundle size > 1MB | Medium | Medium | Code-split in Phase 3 |
| Timer data loss on refresh | High | High | Fix in Phase 1 (P0) |