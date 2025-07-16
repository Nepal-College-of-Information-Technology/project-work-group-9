## 🢑 Team Members

### Group Number: 9

- **Anisha Adhikari** (221609) – Backend Developer  
- **Lamin Tamang** (221720) – Backend Developer  
- **Nishan Giri** (221728) – Backend Developer  
- **Prawneel Poudel** (221734) – Frontend Developer  

---

## 📘 Project Abstract

Our project is a full-stack **Library Management System** designed to help librarians and users efficiently manage books, authors, categories, and availability status. The system is built with **FastAPI** for the backend and **React.js with TypeScript** for the frontend, using **TinyDB** as a lightweight NoSQL database.

The system is targeted toward educational institutions and small organizations where a lightweight, easy-to-deploy, and cost-effective solution is more practical than traditional, complex systems. Using **Docker**, we ensure consistent environments across different machines, improving portability and deployment speed.

---

## ❗ Problem Statement

1. **Challenge**: Traditional library systems are often outdated, inaccessible remotely, and hard to manage without technical expertise.  
2. **Context**: With growing digital needs, libraries require a lightweight, intuitive, and maintainable solution, even in low-resource settings.  
3. **Impact**: A cloud-ready, containerized library system significantly reduces operational overhead while improving accessibility and data handling.

---

## 🎯 Project Objectives

1. Develop a modern web application for managing library operations (books, authors, and categories).  
2. Use **Docker** for containerization, ensuring consistent environments and simple deployment.  
3. Implement **FastAPI** for RESTful API development and **React.js with TypeScript** for a clean, interactive frontend.  
4. Integrate **TinyDB** for lightweight, JSON-based data persistence with minimal setup.

---

## 🏗️ System Architecture

### System Layers:

- **Frontend**
  - Built with **React.js** and **TypeScript**
  - Provides a user-friendly interface for managing library data
  - Supports CRUD operations for books, authors, and categories  

- **Backend**
  - Developed using **FastAPI**
  - Organized with modular API routes:
    - Author APIs  
    - Book APIs  
    - Category APIs  
    - Utility APIs (e.g., bulk upload, filters)

- **Database**
  - **TinyDB**, a lightweight, document-oriented JSON-based database

- **Deployment**
  - Fully **Dockerized** setup
  - Deployable using `docker-compose` for both backend and frontend

---

## 🛠️ Technologies & Tools Used

### Cloud Platform  
- Localhost (via Docker containers)

### Programming Languages  
- Python (FastAPI)  
- TypeScript (React)

### Database  
- TinyDB (local JSON-based storage)

### Frameworks & Libraries  
- **Backend**: FastAPI, Pydantic  
- **Frontend**: React.js, TypeScript  

### DevOps & Deployment  
- Docker, Docker Compose

### APIs & Integration  
- RESTful API services

---

## 🚀 How to Run the Project

To run this Library Management System locally using Docker:

### 📁 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed  
- [Docker Compose](https://docs.docker.com/compose/) (comes with Docker)

---

## 🚧 Implementation Highlights

1. Modular API development with structured files like auth_and_book_apis.py, bulk_action_apis.py, etc.  
2. Utilized **FastAPI routers** for scalable API architecture.  
3. Integrated **TinyDB** with custom serialization for flexible storage.  
4. Implemented Docker containers for backend and frontend for consistent deployment.  
5. Cross-functional team collaboration ensured faster development and smooth integration.

---

## 🧪 Testing & Validation

1. **Swagger UI** used for testing and exploring REST endpoints.  
2. **Postman** for manual testing of JSON payloads.  
3. **Validation** handled via Pydantic models to ensure input consistency.  
4. **Functional Testing** conducted within Docker containers post-deployment.

---

## 📈 Results & Performance

- **Response Time**: ~<100ms on local requests  
- **Concurrent Load**: Handles multiple API requests without degradation  
- **Deployment Cost**: Zero, using Docker and local JSON storage  
- **System Efficiency**: FastAPI and TinyDB offer low overhead and quick startup

---

## 🔮 Future Enhancements

1. Replace **TinyDB** with **PostgreSQL** or **MongoDB** for greater scalability  
2. Implement authentication and **Role-Based Access Control (RBAC)**  
3. Add advanced UI features like filtering, sorting, and search  
4. Integrate **CI/CD** pipelines using GitHub Actions or Jenkins  
5. Host the application on cloud platforms such as **AWS EC2**, **Render**, or **Railway**

---

## 🙌 Acknowledgments

- **Team Collaboration**: Special thanks to all team members for their active participation and consistent contributions.  
- **Open-Source Tools**: Thanks to the communities of **FastAPI**, **React**, **TinyDB**, and **Docker** for their comprehensive documentation and support.

---

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)  
- [TinyDB Documentation](https://tinydb.readthedocs.io/)  
- [React.js Documentation](https://reactjs.org/)  
- [Docker Documentation](https://docs.docker.com/)  
- [Pydantic Documentation](https://docs.pydantic.dev/)

---

## ⚖️ License

This project is developed for academic purposes. License information (e.g., MIT, Apache 2.0) may be added if required.


Our project aims to build a full-stack **Library Management System** that allows librarians and users to manage books, authors, categories, and book availability. The system is developed using **FastAPI** for the backend and **React.js** and **typescript** for the frontend, and utilizes **TinyDB** as a lightweight database.

This project addresses the need for an efficient and modernized approach to handling library data without relying on heavy relational databases. It is particularly relevant for educational or small organizational use where resources are limited, and flexibility is essential. The use of Docker further ensures easy deployment and portability.
