# Application Design Plan

## Execution Checklist
- [x] Step 1: Define backend API components and responsibilities
- [x] Step 2: Define component methods and interfaces
- [x] Step 3: Define service layer and orchestration
- [x] Step 4: Define component dependencies and communication patterns
- [x] Step 5: Generate consolidated application design document
- [x] Step 6: Validate design completeness

---

## Questions

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

### Question 1
백엔드 API 구조를 어떻게 구성하시겠습니까?

A) 도메인별 라우터 분리 (stores, tables, menus, orders 각각 별도 라우터)
B) 사용자 유형별 분리 (customer API, admin API)
C) 단일 라우터에 모든 엔드포인트
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
데이터 접근 패턴은 어떤 것을 선호하시나요?

A) Repository 패턴 (각 도메인별 Repository 클래스)
B) ORM 직접 사용 (SQLAlchemy 모델 직접 쿼리)
C) Other (please describe after [Answer]: tag below)

[Answer]: 추천해줘

### Question 3
SSE(Server-Sent Events) 이벤트 발행 방식은 어떻게 하시겠습니까?

A) In-memory 이벤트 버스 (단일 서버 인스턴스 기준)
B) Redis Pub/Sub 기반 (다중 서버 확장 가능)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
파일 업로드(메뉴 이미지) 저장소는 어떻게 구성하시겠습니까?

A) 서버 로컬 파일시스템 (Docker 볼륨 마운트)
B) MinIO (S3 호환 오브젝트 스토리지, Docker Compose에 추가)
C) Other (please describe after [Answer]: tag below)

[Answer]: A
