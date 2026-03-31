# Functional Design Clarification Questions

Q5에서 추천을 요청하셨습니다.

## Clarification Question 1
장바구니 로컬 저장 방식으로 **A) localStorage**를 추천합니다.

**추천 이유**:
- 페이지 새로고침/브라우저 재시작 시에도 데이터 유지 (요구사항 충족)
- sessionStorage는 탭 닫으면 사라져서 부적합
- IndexedDB는 장바구니 수준의 단순 데이터에 과도한 복잡성
- localStorage가 가장 간단하고 PoC에 적합

이 추천을 수락하시겠습니까?

A) Yes - localStorage 사용
B) No - sessionStorage 사용
C) No - IndexedDB 사용
D) Other (please describe after [Answer]: tag below)

[Answer]: 
