# Requirements Verification Questions

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.
적합한 선택지가 없으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
백엔드 프로그래밍 언어는 무엇을 사용하시겠습니까?

A) Java (Spring Boot)
B) TypeScript (Node.js / Express or NestJS)
C) Python (FastAPI / Django)
D) Go
E) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
프론트엔드 프레임워크는 무엇을 사용하시겠습니까?

A) React (TypeScript)
B) Vue.js (TypeScript)
C) Next.js (React 기반 풀스택)
D) Angular
E) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3
데이터베이스는 무엇을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) Amazon DynamoDB
D) MongoDB
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
배포 환경은 어디를 대상으로 하시겠습니까?

A) AWS (EC2, ECS, Lambda 등 클라우드 서비스)
B) 로컬/온프레미스 서버 (Docker Compose 등)
C) AWS 서버리스 (Lambda + API Gateway + DynamoDB)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
매장(Store)은 단일 매장만 지원하면 되나요, 아니면 멀티 매장(SaaS)을 지원해야 하나요?

A) 단일 매장 (하나의 매장만 운영)
B) 멀티 매장 (여러 매장이 각각 독립적으로 운영)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
메뉴 이미지 저장 방식은 어떻게 하시겠습니까?

A) 외부 URL 링크만 저장 (이미지 업로드 기능 없음)
B) 파일 업로드 지원 (서버 또는 클라우드 스토리지에 저장)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 7
관리자 계정 관리 방식은 어떻게 하시겠습니까?

A) 사전 등록된 관리자 계정 사용 (DB 시딩 또는 CLI로 생성)
B) 관리자 회원가입 기능 포함
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
고객용 UI와 관리자용 UI를 어떻게 구성하시겠습니까?

A) 하나의 프론트엔드 앱에서 라우팅으로 분리
B) 별도의 프론트엔드 앱 2개 (고객용, 관리자용)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 9
주문 상태 실시간 업데이트(고객 화면)는 MVP에 포함하시겠습니까?

A) Yes - 고객 화면에서도 SSE로 주문 상태 실시간 업데이트
B) No - 고객은 페이지 새로고침으로 상태 확인 (관리자만 SSE)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 11: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)
B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)
C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
