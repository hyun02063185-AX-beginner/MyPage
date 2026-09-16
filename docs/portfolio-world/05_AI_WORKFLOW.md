# 05. Portfolio World — Multi-AI Workflow

## 1. 용어 규칙

프로젝트 역할명은 `Director`로 통일한다.

모델은 항상 전체 이름을 사용한다.
예: `GPT-5.6 Sol High`, `GPT-5.6 Terra High`

## 2. Agent 층위

### Project-level
- Director: Product/Game Direction
- Codex: Lead Developer
- Claude Code: Architecture/UX Reviewer + Backup Developer
- DeepSeek: Regression QA + Low-risk Backup Developer

### Claude Code internal subagents
기존 `.claude/agents/*.md`는 Claude Code 내부 작업 분담 체계다.

기존 M01용 파일 경계를 Portfolio World에 자동 적용하지 않는다.

## 3. Director
Default model: `GPT-5.6 Sol High`

담당:
- 기획
- IA
- UX
- 우선순위
- scope decision
- Release Gate

## 4. Lead Developer
Codex baseline: `GPT-5.6 Terra High`
Escalation: `GPT-5.6 Sol High`

## 5. Claude Code
Baseline: `Sonnet 5`
Primary: architecture/UX/code review
Secondary: Backup Developer
Milestone: Opus 선택 가능

## 6. DeepSeek
Primary: regression QA
Secondary: low-risk development
Availability: Home Windows Desktop

## 7. Normal Flow

```text
Director planning
→ Claude pre-review
→ Director design gate
→ Codex implementation
→ tests/harness
→ DeepSeek QA when available
→ Claude final review
→ Director release gate
→ User play test
```
