# OMR API Documentation

## Endpoints

List of available endpoints:

- `GET /`
- `POST /register`
- `POST /login`
- `POST /google-login`
- `POST /payment/notification` _(public webhook)_

Routes below need **authentication** (`Authorization: Bearer <access_token>`):

- `GET /user`
- `GET /exercises`
- `GET /workout-classes`
- `GET /workout-classes-user`
- `POST /workout-classes/:classId`
- `DELETE /workout-classes/:classId`
- `PATCH /memberships`
- `POST /payment/generate-token`
- `GET /payment/status/:orderId`
- `POST /generate-workout-plan`

---

## 1. GET /

**Description**

- Health check

**Request**

- none

**Response (200 - OK)**

```text
Hello World!
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 2. POST /register

**Description**

- Register a new user

**Request**

- body:

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201 - Created)**

```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Response (400 - Bad Request)**

```json
{ "message": "Validation error message" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 3. POST /login

**Description**

- Login with email & password

**Request**

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 - OK)**

```json
{ "access_token": "string" }
```

**Response (400 - Bad Request)**  
_if the field is empty_

```json
{ "message": "Email is required" }
```

```json
{ "message": "Password is required" }
```

**Response (401 - Unauthorized)**  
_if credentials fail_

```json
{ "message": "Email or password is invalid" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 4. POST /google-login

**Description**

- Login/Register with Google ID token

**Request**

- body:

```json
{ "googleToken": "string" }
```

**Response (200 - OK)**

```json
{ "access_token": "string" }
```

**Response (400 - Bad Request)**

```json
{ "message": "Invalid Google token" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 5. POST /payment/notification

> **Public** — Webhook Midtrans (tanpa auth).  
> The server processes the payment status and can activate the user's membership.

**Request**

- body: _payload dari Midtrans (apa adanya)_

**Response (200 - OK)**

```json
{ "message": "Notification processed" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 6. GET /user

**Description**

- Get the profile of the currently logged in user

**Request**

- headers:

```json
{ "Authorization": "Bearer <access_token>" }
```

**Response (200 - OK)**

```json
{
  "id": 1,
  "fullName": "User Name",
  "email": "user@example.com",
  "isMembership": false
}
```

**Response (401 - Unauthorized)**

```json
{ "message": "Invalid Token" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 7. GET /exercises

**Description**

- Get all the exercise

**Request**

- headers:

```json
{ "Authorization": "Bearer <access_token>" }
```

**Response (200 - OK)**

```json
{
  "exercises": [
    { "name": "Football (Soccer)", "category": "team", "intensity": "high" }
  ]
}
```

**Response (401 - Unauthorized)**

```json
{ "message": "Invalid token" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 8. GET /workout-classes

**Description**

- Get all workout classes

**Request**

- headers:

```json
{ "Authorization": "Bearer <access_token>" }
```

**Response (200 - OK)**

```json
{
  "classes": [{ "name": "Bootcamp A", "quota": 10, "currentQuota": 7 }]
}
```

**Response (401 - Unauthorized)**

```json
{ "message": "Invalid token" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 9. GET /workout-classes-user

**Description**

- Gets a list of classes a user has taken (along with `WorkoutClass` data)

**Request**

- headers:

```json
{ "Authorization": "Bearer <access_token>" }
```

**Response (200 - OK)**

```json
{
  "classes": [
    {
      "WorkoutClass": { "name": "Bootcamp A", "coach": "John Doe" }
    }
  ]
}
```

**Response (401 - Unauthorized)**

```json
{ "message": "Invalid token" }
```

**Response (500 - Internal Server Error)**

```json
{ "message": "Internal Server Error" }
```

---

## 10. POST /workout-classes/:classId

**Description**

- Join a workout class

**Request**

- params:

```json
{ "classId": "number (required)" }
```

- headers:

```json
{ "Authorization": "Bearer <access_token>" }
```

**Response (201 - Created)**

```json
{ "message": "Joined successfully" }
```

**Response (400 - Bad Request)**

```json
{ "message": "Workout class is full" }
```

**Response (404 - Not Found)**

```json
{ "message": "Workout class not found" }
```

---

## 11. DELETE /workout-classes/:classId

**Description**

- Cancel joining the workout class

**Request**

- params:

```json
{ "classId": "number (required)" }
```

**Response (200 - OK)**

```json
{
  "message": "Workout class with id <classId> deleted for User with id <userId>"
}
```

---

## 12. PATCH /memberships

**Description**

- Activate membership on logged in user account

**Response (200 - OK)**

```json
{
  "message": "Membership status updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "isMembership": true
  }
}
```

---

## 13. POST /payment/generate-token

**Description**

- Create Snap transactions for membership (Midtrans Sandbox)

**Response (200 - OK)**

```json
{
  "token": "snap-token",
  "redirect_url": "https://app.sandbox.midtrans.com/"
}
```

---

## 14. GET /payment/status/:orderId

**Description**

- Check transaction status with Midtrans

**Response (200 - OK)**

```json
{ "transaction_status": "settlement" }
```

---

## 15. POST /generate-workout-plan

**Description**

- Generate 7-day workout plan base on AI (Gemini)

**Request**

```json
{ "programName": "Football (Soccer)" }
```

**Response (200 - OK)**

```json
{
  "programName": "Football (Soccer)",
  "workoutPlan": [{ "day": 1, "focus": "Cardio" }]
}
```

---

## Global Error Responses

- **400 Bad Request**
- **401 Unauthorized**
- **404 Not Found**
- **500 Internal Server Error**

---

## Authentication

Use headers:

```http
Authorization: Bearer <access_token>
```

---

## Environment Variables

- `GOOGLE_CLIENT_ID`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `CLIENT_URL`
- `PORT`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `DATABASE_URL`
- `NODE_ENV`




