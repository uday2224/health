# Backend API Requirements for TezHealth Frontend

**Frontend Status:** 25% Complete (Auth + Admin)  
**Backend Needed For:** Patient + Nurse + Real-time Features  
**Priority:** 🔴 HIGH — Blocking 75% of frontend development

---

## 📋 API ENDPOINTS REQUIRED

### 1. AUTHENTICATION ENDPOINTS

#### `POST /api/auth/send-otp`
**Purpose:** Send OTP to phone number  
**Request:**
```json
{
  "phone": "+919876543210"
}
```
**Response:**
```json
{
  "success": true,
  "otp_id": "otp_abc123",
  "expires_in": 600,
  "message": "OTP sent to +919876543210"
}
```
**Error Codes:** 400 (invalid phone), 429 (rate limit)

---

#### `POST /api/auth/verify-otp`
**Purpose:** Verify OTP and create/login user  
**Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "otp_id": "otp_abc123"
}
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "phone": "+919876543210",
    "email": "user@email.com",
    "name": "John Doe",
    "role": "patient",
    "created_at": "2026-03-25T10:00:00Z"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "is_new_user": false
}
```
**Error Codes:** 400 (invalid OTP), 401 (OTP expired), 429 (too many attempts)

---

#### `POST /api/auth/register`
**Purpose:** Complete registration after OTP verification  
**Request:**
```json
{
  "phone": "+919876543210",
  "name": "John Doe",
  "email": "john@email.com",
  "role": "patient",
  "metadata": {
    "address": "MG Road, Shimoga",
    "blood_group": "O+",
    "license_number": "KA-LIC-2024-001",
    "specializations": ["Wound Care", "IV Therapy"]
  }
}
```
**Response:**
```json
{
  "success": true,
  "user": { ... },
  "access_token": "...",
  "refresh_token": "..."
}
```

---

#### `POST /api/auth/refresh`
**Purpose:** Refresh access token  
**Request:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```
**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "expires_in": 3600
}
```

---

#### `POST /api/auth/logout`
**Purpose:** Logout user  
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. PATIENT ENDPOINTS

#### `POST /api/bookings`
**Purpose:** Create a new booking  
**Request:**
```json
{
  "patient_id": "p1",
  "nurse_id": "n1",
  "date": "2026-03-26",
  "time": "10:00 AM",
  "service_type": "Scheduled",
  "location": {
    "address": "MG Road, Shimoga",
    "pincode": "577201",
    "latitude": 13.9299,
    "longitude": 75.5681
  },
  "prescription_id": "rx_123",
  "notes": "Post-surgery wound care",
  "amount": 799
}
```
**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "BK001",
    "patient_id": "p1",
    "nurse_id": "n1",
    "status": "PENDING",
    "created_at": "2026-03-25T10:00:00Z"
  }
}
```

---

#### `GET /api/bookings`
**Purpose:** Get patient's bookings  
**Query Params:**
- `patient_id` (required)
- `status` (optional): PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
- `limit` (optional): default 20
- `offset` (optional): default 0

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "BK001",
      "patient_id": "p1",
      "nurse_id": "n1",
      "nurse_name": "Deepa R.",
      "date": "2026-03-26",
      "time": "10:00 AM",
      "status": "CONFIRMED",
      "amount": 799,
      "payment_status": "Paid",
      "created_at": "2026-03-25T10:00:00Z"
    }
  ],
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

---

#### `GET /api/bookings/:id`
**Purpose:** Get booking details  
**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "BK001",
    "patient_id": "p1",
    "nurse_id": "n1",
    "nurse_name": "Deepa R.",
    "date": "2026-03-26",
    "time": "10:00 AM",
    "status": "IN_PROGRESS",
    "location": { ... },
    "prescription": { ... },
    "notes": "...",
    "amount": 799,
    "payment_status": "Paid",
    "timeline": [
      { "status": "PENDING", "timestamp": "2026-03-25T10:00:00Z" },
      { "status": "CONFIRMED", "timestamp": "2026-03-25T10:30:00Z" },
      { "status": "IN_PROGRESS", "timestamp": "2026-03-26T10:00:00Z" }
    ]
  }
}
```

---

#### `PATCH /api/bookings/:id/cancel`
**Purpose:** Cancel a booking  
**Request:**
```json
{
  "reason": "Emergency came up"
}
```
**Response:**
```json
{
  "success": true,
  "booking": { ... }
}
```

---

#### `POST /api/prescriptions/upload`
**Purpose:** Upload prescription image  
**Request:** multipart/form-data
- `file`: image file (JPG, PNG, PDF, max 10MB)
- `patient_id`: patient ID

**Response:**
```json
{
  "success": true,
  "prescription": {
    "id": "rx_123",
    "patient_id": "p1",
    "image_url": "https://...",
    "status": "UPLOADED",
    "created_at": "2026-03-25T10:00:00Z"
  }
}
```

---

#### `POST /api/prescriptions/:id/extract`
**Purpose:** Extract medicines from prescription using AI  
**Request:**
```json
{
  "prescription_id": "rx_123"
}
```
**Response:**
```json
{
  "success": true,
  "prescription": {
    "id": "rx_123",
    "status": "EXTRACTED",
    "medicines": [
      {
        "name": "Amoxicillin 500mg",
        "dosage": "500mg",
        "frequency": "3 times/day",
        "duration": "7 days",
        "instructions": "After meals",
        "confidence": 95
      }
    ]
  }
}
```

---

#### `POST /api/prescriptions/:id/confirm`
**Purpose:** Confirm extracted medicines  
**Request:**
```json
{
  "medicines": [
    {
      "name": "Amoxicillin 500mg",
      "dosage": "500mg",
      "frequency": "3 times/day",
      "duration": "7 days",
      "instructions": "After meals"
    }
  ]
}
```
**Response:**
```json
{
  "success": true,
  "prescription": {
    "id": "rx_123",
    "status": "CONFIRMED"
  }
}
```

---

#### `GET /api/prescriptions`
**Purpose:** Get patient's prescriptions  
**Query Params:**
- `patient_id` (required)
- `status` (optional): UPLOADED, EXTRACTED, CONFIRMED, USED

**Response:**
```json
{
  "success": true,
  "prescriptions": [
    {
      "id": "rx_123",
      "patient_id": "p1",
      "image_url": "https://...",
      "status": "CONFIRMED",
      "medicine_count": 4,
      "created_at": "2026-03-25T10:00:00Z"
    }
  ]
}
```

---

#### `GET /api/nurses`
**Purpose:** Search nurses  
**Query Params:**
- `specialization` (optional): Wound Care, IV Therapy, etc.
- `rating_min` (optional): minimum rating (0-5)
- `location` (optional): pincode or area
- `distance_km` (optional): search radius
- `limit` (optional): default 20
- `offset` (optional): default 0

**Response:**
```json
{
  "success": true,
  "nurses": [
    {
      "id": "n1",
      "name": "Deepa R.",
      "specializations": ["Wound Care", "IV Therapy"],
      "rating": 4.9,
      "reviews": 142,
      "experience": 8,
      "price_per_visit": 799,
      "completion_rate": 98,
      "verified": true,
      "available": true
    }
  ],
  "total": 45
}
```

---

#### `GET /api/nurses/:id`
**Purpose:** Get nurse profile  
**Response:**
```json
{
  "success": true,
  "nurse": {
    "id": "n1",
    "name": "Deepa R.",
    "phone": "+919876543220",
    "specializations": ["Wound Care", "IV Therapy"],
    "rating": 4.9,
    "reviews": 142,
    "experience": 8,
    "bio": "8 years of experience...",
    "price_per_visit": 799,
    "completion_rate": 98,
    "total_bookings": 312,
    "verified": true,
    "reviews_list": [
      {
        "id": "r1",
        "patient_initials": "RK",
        "rating": 5,
        "comment": "Excellent care!",
        "date": "2026-03-20"
      }
    ]
  }
}
```

---

#### `POST /api/subscriptions`
**Purpose:** Subscribe to a plan  
**Request:**
```json
{
  "patient_id": "p1",
  "plan_id": "monthly",
  "payment_method_id": "pm_123"
}
```
**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "patient_id": "p1",
    "plan_id": "monthly",
    "status": "ACTIVE",
    "visits_remaining": 8,
    "next_billing_date": "2026-04-25",
    "created_at": "2026-03-25T10:00:00Z"
  }
}
```

---

#### `GET /api/subscriptions/:id`
**Purpose:** Get subscription details  
**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123",
    "plan_name": "Monthly",
    "plan_price": 999,
    "visits_total": 8,
    "visits_used": 3,
    "visits_remaining": 5,
    "status": "ACTIVE",
    "next_billing_date": "2026-04-25",
    "upcoming_visits": [
      { "date": "2026-03-28", "time": "10:00 AM" },
      { "date": "2026-04-01", "time": "2:00 PM" }
    ]
  }
}
```

---

#### `PATCH /api/subscriptions/:id/pause`
**Purpose:** Pause subscription  
**Response:**
```json
{
  "success": true,
  "subscription": { ... }
}
```

---

#### `PATCH /api/subscriptions/:id/cancel`
**Purpose:** Cancel subscription  
**Request:**
```json
{
  "reason": "No longer needed"
}
```
**Response:**
```json
{
  "success": true,
  "subscription": { ... }
}
```

---

#### `GET /api/payments`
**Purpose:** Get patient's payment history  
**Query Params:**
- `patient_id` (required)
- `status` (optional): Paid, Pending, Failed, Refunded
- `type` (optional): Booking, Subscription, Consultation
- `date_from` (optional): YYYY-MM-DD
- `date_to` (optional): YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "id": "PAY001",
      "stripe_id": "pi_3abc123",
      "amount": 799,
      "type": "Booking",
      "description": "Booking - Wound Care",
      "status": "Paid",
      "date": "2026-03-24",
      "receipt_url": "https://..."
    }
  ],
  "total": 8
}
```

---

#### `POST /api/ratings`
**Purpose:** Rate and review a booking  
**Request:**
```json
{
  "booking_id": "BK001",
  "nurse_id": "n1",
  "rating": 5,
  "tags": ["Punctual", "Professional", "Caring"],
  "comment": "Excellent care! Very professional."
}
```
**Response:**
```json
{
  "success": true,
  "rating": {
    "id": "r1",
    "booking_id": "BK001",
    "nurse_id": "n1",
    "rating": 5,
    "created_at": "2026-03-26T10:00:00Z"
  }
}
```

---

### 3. NURSE ENDPOINTS

#### `POST /api/nurse/onboarding`
**Purpose:** Complete nurse onboarding  
**Request:** multipart/form-data
```json
{
  "nurse_id": "n1",
  "license_number": "KA-LIC-2024-001",
  "license_document": "file",
  "specializations": ["Wound Care", "IV Therapy"],
  "id_proof_type": "Aadhar",
  "id_proof_document": "file",
  "experience_years": 8,
  "bio": "8 years of experience in post-operative care"
}
```
**Response:**
```json
{
  "success": true,
  "nurse": {
    "id": "n1",
    "status": "PENDING_VERIFICATION",
    "message": "Application submitted. We'll verify within 24 hours."
  }
}
```

---

#### `PATCH /api/nurse/availability`
**Purpose:** Toggle nurse availability  
**Request:**
```json
{
  "nurse_id": "n1",
  "is_online": true
}
```
**Response:**
```json
{
  "success": true,
  "nurse": {
    "id": "n1",
    "is_online": true,
    "last_updated": "2026-03-25T10:00:00Z"
  }
}
```

---

#### `GET /api/jobs`
**Purpose:** Get available jobs for nurse  
**Query Params:**
- `nurse_id` (required)
- `status` (optional): PENDING, ACCEPTED, COMPLETED
- `type` (optional): Scheduled, Acute

**Response:**
```json
{
  "success": true,
  "jobs": [
    {
      "id": "BK001",
      "patient_initials": "RK",
      "date": "2026-03-26",
      "time": "10:00 AM",
      "area": "MG Road, Shimoga",
      "service_type": "Scheduled",
      "estimated_duration": "2 hours",
      "pay_amount": 799,
      "has_prescription": true,
      "created_at": "2026-03-25T10:00:00Z"
    }
  ],
  "total": 3
}
```

---

#### `GET /api/jobs/:id`
**Purpose:** Get job details  
**Response:**
```json
{
  "success": true,
  "job": {
    "id": "BK001",
    "patient_name": "Rajesh Kumar",
    "patient_phone": "+919876543210",
    "patient_address": "MG Road, Shimoga",
    "date": "2026-03-26",
    "time": "10:00 AM",
    "service_type": "Scheduled",
    "estimated_duration": "2 hours",
    "pay_amount": 799,
    "prescription": {
      "medicines": [
        { "name": "Amoxicillin", "dosage": "500mg", "frequency": "3x/day" }
      ]
    },
    "notes": "Post-surgery wound care",
    "location": {
      "address": "MG Road, Shimoga",
      "latitude": 13.9299,
      "longitude": 75.5681
    }
  }
}
```

---

#### `POST /api/jobs/:id/accept`
**Purpose:** Accept a job  
**Request:**
```json
{
  "nurse_id": "n1"
}
```
**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "BK001",
    "status": "CONFIRMED",
    "nurse_id": "n1"
  }
}
```

---

#### `POST /api/jobs/:id/complete`
**Purpose:** Mark job as completed  
**Request:**
```json
{
  "nurse_id": "n1",
  "services_rendered": ["Wound dressing", "IV therapy"],
  "medicines_administered": ["Amoxicillin"],
  "notes": "Wound healing well, no complications"
}
```
**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "BK001",
    "status": "COMPLETED",
    "earnings": 679
  }
}
```

---

#### `POST /api/nurse/location`
**Purpose:** Update nurse location (GPS)  
**Request:**
```json
{
  "nurse_id": "n1",
  "booking_id": "BK001",
  "latitude": 13.9299,
  "longitude": 75.5681,
  "accuracy": 10
}
```
**Response:**
```json
{
  "success": true,
  "message": "Location updated"
}
```

---

#### `GET /api/earnings`
**Purpose:** Get nurse earnings  
**Query Params:**
- `nurse_id` (required)
- `period` (optional): week, month, all
- `date_from` (optional): YYYY-MM-DD
- `date_to` (optional): YYYY-MM-DD

**Response:**
```json
{
  "success": true,
  "earnings": {
    "period": "week",
    "gross_earnings": 3400,
    "platform_cut": 510,
    "net_earnings": 2890,
    "jobs_completed": 5,
    "trend": "+12%",
    "daily_breakdown": [
      { "date": "2026-03-20", "earnings": 799 },
      { "date": "2026-03-21", "earnings": 1498 }
    ]
  }
}
```

---

#### `GET /api/payouts`
**Purpose:** Get payout history  
**Query Params:**
- `nurse_id` (required)

**Response:**
```json
{
  "success": true,
  "payouts": [
    {
      "id": "payout_123",
      "week": "2026-03-17 to 2026-03-23",
      "jobs_done": 5,
      "gross": 3400,
      "platform_cut": 510,
      "net": 2890,
      "status": "Paid",
      "date": "2026-03-24"
    }
  ]
}
```

---

#### `POST /api/payouts`
**Purpose:** Request payout  
**Request:**
```json
{
  "nurse_id": "n1",
  "amount": 2890,
  "bank_account_id": "ba_123"
}
```
**Response:**
```json
{
  "success": true,
  "payout": {
    "id": "payout_123",
    "amount": 2890,
    "status": "Processing",
    "estimated_arrival": "2026-03-26"
  }
}
```

---

#### `GET /api/nurse/profile`
**Purpose:** Get nurse profile  
**Query Params:**
- `nurse_id` (required)

**Response:**
```json
{
  "success": true,
  "nurse": {
    "id": "n1",
    "name": "Deepa R.",
    "phone": "+919876543220",
    "specializations": ["Wound Care", "IV Therapy"],
    "rating": 4.9,
    "reviews_count": 142,
    "experience": 8,
    "bio": "8 years of experience...",
    "verified": true,
    "verification_status": "ACTIVE",
    "total_bookings": 312,
    "completion_rate": 98,
    "member_since": "2024-12-01",
    "documents": {
      "license": { "status": "VERIFIED", "url": "https://..." },
      "id_proof": { "status": "VERIFIED", "url": "https://..." }
    },
    "reviews": [
      {
        "id": "r1",
        "patient_initials": "RK",
        "rating": 5,
        "comment": "Excellent care!",
        "date": "2026-03-20"
      }
    ]
  }
}
```

---

### 4. ADMIN ENDPOINTS

#### `GET /api/admin/stats`
**Purpose:** Get admin dashboard stats  
**Response:**
```json
{
  "success": true,
  "stats": {
    "total_users": 1250,
    "total_patients": 850,
    "total_nurses": 320,
    "active_nurses": 245,
    "pending_verification": 12,
    "platform_revenue": 125000,
    "total_bookings": 3456,
    "active_today": 23,
    "completed_bookings": 2891,
    "cancelled_bookings": 167
  }
}
```

---

#### `PATCH /api/admin/nurses/:id/verify`
**Purpose:** Approve or reject nurse verification  
**Request:**
```json
{
  "action": "approve",
  "reason": "All documents verified"
}
```
**Response:**
```json
{
  "success": true,
  "nurse": {
    "id": "n1",
    "status": "ACTIVE",
    "verification_status": "active"
  }
}
```

---

#### `PATCH /api/admin/users/:id/role`
**Purpose:** Change user role  
**Request:**
```json
{
  "new_role": "nurse",
  "reason": "User requested role change"
}
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "u1",
    "role": "nurse"
  }
}
```

---

#### `POST /api/admin/refunds`
**Purpose:** Initiate refund  
**Request:**
```json
{
  "booking_id": "BK001",
  "amount": 799,
  "reason": "Booking cancelled by patient"
}
```
**Response:**
```json
{
  "success": true,
  "refund": {
    "id": "ref_123",
    "booking_id": "BK001",
    "amount": 799,
    "status": "Processing"
  }
}
```

---

#### `GET /api/admin/payments`
**Purpose:** Get all payments  
**Query Params:**
- `date_from` (optional): YYYY-MM-DD
- `date_to` (optional): YYYY-MM-DD
- `status` (optional): Paid, Pending, Failed, Refunded
- `type` (optional): Booking, Subscription, Consultation

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "id": "PAY001",
      "stripe_id": "pi_3abc123",
      "patient_name": "Rajesh Kumar",
      "nurse_name": "Deepa R.",
      "amount": 799,
      "type": "Booking",
      "status": "Paid",
      "date": "2026-03-24"
    }
  ],
  "total": 156
}
```

---

### 5. REAL-TIME ENDPOINTS

#### Supabase Realtime Subscriptions
**Tables to subscribe:**
- `bookings` — INSERT, UPDATE
- `notifications` — INSERT
- `users` — UPDATE
- `nurse_availability` — UPDATE

**Example subscription (Frontend):**
```typescript
supabase
  .from('bookings')
  .on('*', payload => {
    console.log('Booking updated:', payload);
  })
  .subscribe();
```

---

#### Socket.io Events

**Emit (Frontend → Backend):**
```typescript
// Nurse broadcasts location
socket.emit('nurse:location', {
  booking_id: 'BK001',
  nurse_id: 'n1',
  latitude: 13.9299,
  longitude: 75.5681
});

// Patient requests tracking
socket.emit('patient:request:tracking', {
  booking_id: 'BK001'
});
```

**Listen (Frontend):**
```typescript
// Receive location updates
socket.on('nurse:location:update', (data) => {
  console.log('Nurse location:', data);
  // Update map, ETA, distance
});

// Receive new job notification
socket.on('job:new', (job) => {
  console.log('New job available:', job);
  // Show toast notification
});

// Receive payment confirmation
socket.on('payment:succeeded', (payment) => {
  console.log('Payment confirmed:', payment);
  // Update UI
});
```

---

## 🔐 AUTHENTICATION

### Headers Required
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Token Structure (JWT)
```json
{
  "sub": "user_123",
  "role": "patient",
  "phone": "+919876543210",
  "iat": 1711353600,
  "exp": 1711357200
}
```

---

## 📊 ERROR RESPONSES

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Phone number is required",
    "details": {}
  }
}
```

### Common Error Codes
- `400` — Bad Request (validation error)
- `401` — Unauthorized (invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `409` — Conflict (duplicate entry)
- `429` — Rate Limited
- `500` — Server Error

---

## 🚀 IMPLEMENTATION PRIORITY

### Phase 1 (Critical - Blocking Frontend)
1. ✅ Auth endpoints (send-otp, verify-otp, register)
2. 🔴 Booking endpoints (POST, GET, PATCH)
3. 🔴 Nurse search (GET /api/nurses)
4. 🔴 Prescription endpoints (upload, extract, confirm)
5. 🔴 Subscription endpoints (POST, GET, PATCH)

### Phase 2 (High Priority)
6. 🔴 Nurse job endpoints (GET /api/jobs, POST accept)
7. 🔴 Earnings endpoints (GET /api/earnings)
8. 🔴 Payment endpoints (GET /api/payments)
9. 🔴 Admin endpoints (stats, verify, role change)

### Phase 3 (Real-time)
10. 🔴 Supabase Realtime subscriptions
11. 🔴 Socket.io events (location, notifications)

---

## 📝 NOTES FOR BACKEND TEAM

1. **Rate Limiting:** Implement rate limiting on OTP endpoint (max 3 attempts per 5 minutes)
2. **File Upload:** Validate file types and size (max 10MB for prescriptions)
3. **AI Integration:** Prescription extraction should call external AI service
4. **Stripe Integration:** Payment endpoints should integrate with Stripe API
5. **Geolocation:** Store nurse location with timestamp for tracking
6. **Notifications:** Send real-time notifications via Supabase or Socket.io
7. **Audit Logs:** Log all admin actions (role changes, refunds, etc.)
8. **Caching:** Cache nurse profiles and ratings for performance
9. **Pagination:** Implement cursor-based pagination for large datasets
10. **Validation:** Validate all inputs on backend (don't trust frontend)

---

## 🎯 ESTIMATED BACKEND EFFORT

| Endpoint Group | Endpoints | Effort | Time |
|---|---|---|---|
| Auth | 5 | Medium | 4-6 hrs |
| Patient | 12 | High | 12-16 hrs |
| Nurse | 10 | High | 10-14 hrs |
| Admin | 4 | Medium | 4-6 hrs |
| Real-time | 2 | High | 6-8 hrs |
| **TOTAL** | **33** | **HIGH** | **36-50 hrs** |

**Estimated completion:** 5-7 days with focused development

---

## ✅ TESTING CHECKLIST

- [ ] All endpoints return correct status codes
- [ ] Error messages are clear and helpful
- [ ] Rate limiting works correctly
- [ ] File uploads are validated
- [ ] Pagination works correctly
- [ ] Real-time subscriptions update instantly
- [ ] Socket.io events are received correctly
- [ ] Authentication tokens expire correctly
- [ ] Refresh tokens work correctly
- [ ] Admin actions are logged

---

**Ready to start backend development?**
