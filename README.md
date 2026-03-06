# 🚗 Smart Parking Lot Booking System

A **Backend API for a Smart Parking Lot Booking System** that allows users to reserve parking slots, manage bookings, and handle parking lot operations efficiently.

The system is designed to simulate real-world parking management where users can book available parking slots in advance and manage their parking sessions.

---

# 📌 Features

### 👤 User Features

* User registration and login
* Book parking slots
* View available parking slots
* Cancel parking bookings
* View booking history

### 🏢 Admin / Owner Features

* Create parking lots
* Manage parking slots
* Monitor bookings
* Control parking availability

### ⚙️ System Features

* Slot availability management
* Booking validation
* Secure API architecture
* Transaction handling for booking operations
* Error handling with centralized middleware

---

# 🛠️ Tech Stack

| Technology        | Purpose            |
| ----------------- | ------------------ |
| **Node.js**       | Backend runtime    |
| **Express.js**    | REST API framework |
| **PostgreSQL**    | Database           |
| **Sequelize ORM** | Database ORM       |
| **JWT**           | Authentication     |
| **Jest**          | Unit testing       |
| **Supertest**     | API testing        |

---

# 📂 Project Structure

```
Smart-ParkingLot-Booking
│
├── controllers
│   └── bookingController.js
│
├── models
│   ├── userModel.js
│   ├── parkingLotModel.js
│   ├── parkingSlotModel.js
│   └── bookingModel.js
│
├── routes
│   └── bookingRoutes.js
│
├── middlewares
│   └── errorHandler.js
│
├── utils
│   └── appError.js
│
├── tests
│   └── booking.test.js
│
├── config
│   └── database.js
│
├── app.js
└── package.json
```

---

# ⚙️ Installation

Clone the repository:

```
git clone https://github.com/TrainedDev/Smart-ParkingLot-Booking.git
```

Navigate to the project directory:

```
cd Smart-ParkingLot-Booking
```

Install dependencies:

```
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

```
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=parking_db
JWT_SECRET=your_secret_key
```

---

# ▶️ Running the Server

Start the development server:

```
npm run dev
```

Or run normally:

```
npm start
```

Server will run on:

```
http://localhost:5000
```

---

# 🧪 Running Tests

Run all tests:

```
npm test
```

Testing is implemented using:

* **Jest**
* **Supertest**

---

# 📡 Example API Endpoints

### User Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Parking Lot

```
POST /api/parking-lots
GET /api/parking-lots
```

### Parking Slots

```
GET /api/slots
POST /api/slots
```

### Bookings

```
POST /api/bookings
GET /api/bookings
DELETE /api/bookings/:id
```

---

# 🚀 Future Improvements

* Payment integration
* Real-time slot tracking
* Mobile application integration
* Parking analytics dashboard
* Notification system

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Yogesh Kamble**

GitHub:
https://github.com/TrainedDev
