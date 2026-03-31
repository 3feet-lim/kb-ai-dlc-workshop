# NFR Requirements Plan - All Units

## Execution Checklist
- [x] Step 1: Backend NFR 요구사항 정의
- [x] Step 2: Frontend NFR 요구사항 정의
- [x] Step 3: Tech stack 상세 결정 (버전, 라이브러리)
- [x] Step 4: PBT 프레임워크 선택 확정 (PBT-09)

---

## Questions

아래 질문에 답변해 주세요.

### Question 1
Python 버전은 어떤 것을 사용하시겠습니까?

A) Python 3.11
B) Python 3.12
C) Python 3.13
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 2
Node.js 버전은 어떤 것을 사용하시겠습니까?

A) Node.js 20 LTS
B) Node.js 22 LTS
C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3
ORM으로 SQLAlchemy를 사용할 때 동기/비동기 방식은 어떻게 하시겠습니까?

A) 비동기 (SQLAlchemy async + asyncpg) - FastAPI의 async 특성 활용
B) 동기 (SQLAlchemy + psycopg2) - 간단하고 안정적
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
예상 동시 접속자 수는 어느 정도인가요? (PoC 기준)

A) 소규모 (10명 이하, 단일 매장 테스트)
B) 중규모 (50명 이하, 2~3개 매장)
C) 대규모 (100명 이상)
D) Other (please describe after [Answer]: tag below)

[Answer]: A
