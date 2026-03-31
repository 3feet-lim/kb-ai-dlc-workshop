# Domain Entities - Backend API

## Entity Relationship

```
Store 1──N AdminUser
Store 1──N Table
Store 1──N Category
Store 1──N DailyOrderCounter
Table 1──N TableSession
TableSession 1──N Order
Category 1──N Menu
Order 1──N OrderItem
OrderItem N──1 Menu
```

## Entities

### Store
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| name | String | required, max 100 |
| store_code | String | required, unique, 매장 식별자 |
| created_at | DateTime | auto |

### AdminUser
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| username | String | required, unique per store |
| password_hash | String | required, bcrypt |
| failed_login_attempts | Integer | default 0 |
| locked_until | DateTime | nullable |
| created_at | DateTime | auto |

### Table
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| table_number | Integer | required, unique per store |
| password_hash | String | required, bcrypt |
| created_at | DateTime | auto |

### TableSession
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| table_id | UUID (FK) | required |
| started_at | DateTime | auto (첫 주문 시) |
| ended_at | DateTime | nullable (이용 완료 시) |
| is_active | Boolean | default true |

### Category
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| name | String | required, max 50 |
| sort_order | Integer | default 0 |
| created_at | DateTime | auto |

### Menu
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| category_id | UUID (FK) | required |
| name | String | required, max 100 |
| price | Integer | required, >= 0 |
| description | String | nullable, max 500 |
| image_url | String | nullable |
| sort_order | Integer | default 0 |
| is_available | Boolean | default true |
| created_at | DateTime | auto |

### Order
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| table_id | UUID (FK) | required |
| session_id | UUID (FK) | required |
| order_number | String | 매장별 일련번호 (매일 리셋) |
| status | Enum | PENDING/PREPARING/COMPLETED |
| total_amount | Integer | calculated |
| created_at | DateTime | auto |

### OrderItem
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| order_id | UUID (FK) | required |
| menu_id | UUID (FK) | required |
| menu_name | String | required (주문 시점 스냅샷) |
| quantity | Integer | required, >= 1 |
| unit_price | Integer | required (주문 시점 스냅샷) |
| subtotal | Integer | calculated (quantity * unit_price) |

### OrderHistory
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| table_id | UUID (FK) | required |
| session_id | UUID | required |
| order_data | JSON | 주문 전체 데이터 스냅샷 |
| completed_at | DateTime | 이용 완료 시각 |

### DailyOrderCounter
| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID (PK) | auto-generated |
| store_id | UUID (FK) | required |
| date | Date | required |
| counter | Integer | default 0 |
| unique | (store_id, date) | |
