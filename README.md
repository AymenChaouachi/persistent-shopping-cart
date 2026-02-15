#  Persistent Shopping Cart (No Authentication)

##  Challenge Overview

Users of an e-commerce platform were losing their shopping carts when:

- They closed their browser
- The server restarted
- Multiple users accessed the system
- Old carts were never cleaned

The objective was to implement a **persistent shopping cart system without requiring user authentication**.

---

##  Features Implemented

✔ Browser persistence (cart survives browser close)  
✔ Server persistence (cart survives server restart)  
✔ Multi-user support (separate cart per user)  
✔ Auto-cleanup (cart expires after 7 days of inactivity)  

---

##  Project Structure

shopping-cart/
│
├── server.js # Express server & API routes
├── storage.js # File storage & cleanup logic
├── package.json
├── package-lock.json
├── .gitignore
└── README.md


> `carts.json` is automatically created when the server runs.

---

##  How The System Works

### 1️ Unique Cart Per User
Each user receives a unique `cartId` (UUID).  
This allows multiple users to maintain separate carts without authentication.

### 2️ Persistent Storage
Cart data is stored inside a local JSON file:

carts.json


Because data is saved to disk:
- Closing the browser does NOT delete the cart.
- Restarting the server does NOT delete the cart.

### 3️ Auto-Cleanup Mechanism
Each cart stores a `lastUpdated` timestamp.

On every request:
- The system checks all carts.
- If a cart has been inactive for more than 7 days, it is automatically deleted.

---

##  How To Run The Project

### Step 1 — Install Node.js

Download and install from:

https://nodejs.org

Verify installation:

node -v
npm -v


---

### Step 2 — Install Dependencies

Inside the project folder:

npm install


---

### Step 3 — Start The Server

node server.js


Server will run at:

http://localhost:3000


---


