# Functional Design Plan - All Units

동시 개발 전략에 따라 3개 유닛의 Functional Design을 통합 진행합니다.

## Execution Checklist

### Backend API
- [x] Step 1: Domain entities and relationships 정의
- [x] Step 2: Business rules and validation logic 정의
- [x] Step 3: Business logic model (서비스 워크플로우) 정의
- [x] Step 4: Testable Properties 식별 (PBT-01)

### Customer Frontend
- [x] Step 5: Frontend components 구조 정의
- [x] Step 6: User interaction flows 정의

### Admin Frontend
- [x] Step 7: Frontend components 구조 정의
- [x] Step 8: User interaction flows 정의

---

## Questions

아래 질문에 답변해 주세요.

### Question 1
주문 상태 전이 규칙은 어떻게 하시겠습니까?

A) 단방향만 허용: 대기중 → 준비중 → 완료 (역방향 불가)
B) 유연한 전이: 대기중 ↔ 준비중 → 완료 (완료만 역방향 불가)
C) 완전 자유: 모든 상태 간 전이 가능
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
테이블 세션 시작 시점은 언제인가요?

A) 첫 주문 생성 시 자동으로 세션 시작
B) 관리자가 수동으로 세션 시작 후 주문 가능
C) 테이블 태블릿 로그인 시 자동 세션 시작
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
주문 번호 생성 방식은 어떻게 하시겠습니까?

A) 매장별 일련번호 (매일 리셋, 예: #001, #002)
B) 매장별 일련번호 (리셋 없이 계속 증가)
C) UUID 기반 (고유 식별자)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
메뉴 카테고리 관리 방식은 어떻게 하시겠습니까?

A) 사전 정의된 카테고리 (DB 시딩, 관리자가 추가/수정 불가)
B) 관리자가 카테고리 CRUD 가능
C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 5
장바구니 로컬 저장 방식은 어떤 것을 사용하시겠습니까?

A) localStorage
B) sessionStorage
C) IndexedDB
D) Other (please describe after [Answer]: tag below)

[Answer]: 추천해줘
