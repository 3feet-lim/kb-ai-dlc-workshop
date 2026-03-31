# Units Generation Clarification Questions

Q1, Q3에서 추천을 요청하셨습니다. PoC 맥락을 고려한 추천입니다.

## Clarification Question 1
PoC 단계에서 취합/관리 용이성을 고려하면 **A) 3개 유닛 (Backend API, Customer Frontend, Admin Frontend)**을 추천합니다.

**추천 이유**:
- Docker Compose로 3개 서비스를 한 번에 관리 가능 (이미 배포 환경으로 선택)
- 모노레포 구조로 하나의 저장소에서 관리하면 PoC에서도 취합이 쉬움
- 각 유닛이 독립적이라 기술 스택이 다른 부분(Python/TypeScript)을 깔끔하게 분리
- 추후 프로덕션 전환 시 구조 변경 없이 확장 가능

이 추천을 수락하시겠습니까?

A) Yes - 3개 유닛 (Backend API, Customer Frontend, Admin Frontend)
B) No - 1개 유닛 모노레포 통합 관리
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Clarification Question 2
Q1에서 3개 유닛을 선택하시면 디렉토리 구조는 **A) 모노레포 (루트에 backend/, customer-web/, admin-web/)**를 추천합니다.

**추천 이유**:
- 하나의 저장소에서 모든 코드 관리 (PoC에 적합)
- Docker Compose 파일을 루트에 두고 전체 서비스 한 번에 실행
- 각 디렉토리가 독립적인 의존성 관리 (requirements.txt / package.json)

이 추천을 수락하시겠습니까?

A) Yes - 모노레포 구조
B) No - 다른 구조 선호
C) Other (please describe after [Answer]: tag below)

[Answer]: A
