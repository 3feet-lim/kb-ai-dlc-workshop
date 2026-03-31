# Application Design Clarification Questions

Q2에서 "추천해줘"라고 답변하셨습니다. 프로젝트 맥락을 고려한 추천과 함께 확인 질문을 드립니다.

## Clarification Question 1
데이터 접근 패턴에 대해 **Repository 패턴 (A)**을 추천합니다.

**추천 이유**:
- 도메인별 라우터 분리(Q1=A)와 일관된 계층 구조
- 비즈니스 로직과 데이터 접근 분리로 PBT 테스트 용이
- 멀티 매장 데이터 격리 로직을 Repository에 캡슐화 가능

이 추천을 수락하시겠습니까?

A) Yes - Repository 패턴 사용
B) No - ORM 직접 사용 (SQLAlchemy 모델 직접 쿼리)
C) Other (please describe after [Answer]: tag below)

[Answer]: 
