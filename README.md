# Cosma Beauty

A **modern beauty treatment booking platform** built with **Next.js, MongoDB, and Tailwind CSS**.  
Users can search for skin/hair concerns, discover treatments, view clinic packages, and submit enquiries.  
Admins can manage enquiries from a dedicated dashboard.

---

## 🚀 Tech Stack

- **Frontend:** Next.js (Pages Router), React, Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** MongoDB with Mongoose  
- **Validation:** Zod  
- **UI/UX:** React Hot Toast, Responsive Design  

---

## 📖 Features

- 🔍 Search treatments by skin/hair concern  
- 📦 View clinic packages  
- 📝 Submit customer enquiries  
- 🛠 Admin dashboard to manage enquiries  

---

## 📂 Pages

- `/` → Homepage with search functionality  
- `/admin/enquiries` → Admin dashboard for managing enquiries  

---

## 📡 API Documentation

| Method   | Endpoint         | Description                    | Parameters                |
|----------|-----------------|--------------------------------|---------------------------|
| GET      | `/api/search`   | Search treatments by concern   | `?concern=<text>`         |
| POST     | `/api/enquiries`| Submit customer enquiry        | JSON body                 |
| GET      | `/api/enquiries`| List all enquiries (admin)     | None                      |
| GET/POST | `/api/seed`     | Seed database with sample data | None                      |

---

## ⚙️ Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/rudra-140207/CosmaBeauty.git
cd CosmaBeauty

# 2. Install dependencies
npm install

# 3. Create .env.local file in the root directory
# (paste the following inside .env.local)
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/cosma_beauty?retryWrites=true&w=majority"

# 4. Seed the database with sample data
# (open in browser OR use curl)
# Browser: http://localhost:3000/api/seed
# Curl: curl -X POST http://localhost:3000/api/seed

# 5. Start development server
npm run dev
