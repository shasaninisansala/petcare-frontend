## 🐾 PetCare Platform


A full-stack web platform for **pet adoption, donations, and AI-powered veterinary emergency assistance**.

---

## ✨ Features

- 🐕 My Pets Management 
- 🏠 Shelter Network
- 🐕 Pet adoption  
- 🏥 AI veterinary emergency assistant  
- 💳 Online donations (Stripe)  
- 📸 Pet image uploads  
- 🔐 Authentication (Login / Register)  
- 📊 Admin dashboard  

---

## 🧰 Tech Stack

### Frontend
- React  
- Tailwind CSS  
- Axios  

### Backend
- Spring Boot  
- REST APIs  
- Microservices
### Database
- MySQL  

### AI
- Groq API (LLaMA model)  

### Payments
- Stripe API  

----------------------------------------------------------------------------------------------------------------------------------

## 📂 Project Structure

PetCare/
│
├── frontend/ # React application
├── backend/ # Spring Boot backend
└── database/ # SQL scripts


----------------------------------------------------------------------------------------------------------------------------------

## ⚙️ Installation & Setup

## 🔹Frontend (React)
cd frontend
npm install
npm start
Frontend runs on:
http://localhost:3000

### 🔹 Backend (Spring Boot)

1. Clone the repository
2. Open backend in IntelliJ
3. Configure `application.properties`:

### properties

(already mention in the codes.if need replace follow things)
spring.datasource.username=root
spring.datasource.password=yourpassword

groq.api.key=YOUR_GROQ_API_KEY
groq.api.url=https://api.groq.com/openai/v1/chat/completions

stripe.secret.key=YOUR_STRIPE_SECRET_KEY
Run the application

Backend runs on:
pet owner -petowner-ms :http://localhost:8080
Shelter   -shelter-ms  :http://localhost:8080
Donation  -donation-ms :http://localhost:8080
Adoption  -adoption-ms :http://localhost:8080
AI        -ai          :http://localhost:8086
Admin     -admin-ms    :http://localhost:8080


## 🤖 AI Emergency Vet Assistant
The AI provides structured emergency guidance:

Possible Cause:

Immediate Care:

Go to Vet Immediately if:

Rules:
Asks animal type & age if missing

Clear, short responses


## 🔐 Environment Variables
groq.api.key
stripe.secret.key


## 👥 Contributors

Team : Master Blacky

Team Members:
Nigeeth Maleesha
Shasani Gunawardhane
Dishan Keminda
Dnauja Dewnith
Kulindu Rashmika

