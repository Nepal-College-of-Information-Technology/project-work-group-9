## 🢑 Team Members

### Group Number: 9

Anisha Adhikari(221609) - Backend Developer
Lamin Tamang(221720) - Backend Developer
Nishan Giri(221728) - Backend Developer
Prawneel poudel(221734) - Frontend Developer
---

##  Project Abstract

Our project aims to build a full-stack **Library Management System** that allows librarians and users to manage books, authors, categories, and book availability. The system is developed using **FastAPI** for the backend and **React.js** and **typescript** for the frontend, and utilizes **TinyDB** as a lightweight database.

This project addresses the need for an efficient and modernized approach to handling library data without relying on heavy relational databases. It is particularly relevant for educational or small organizational use where resources are limited, and flexibility is essential. The use of Docker further ensures easy deployment and portability.

---

##  Problem Statements

1. **Challenge**: Traditional library systems are often outdated, not easily accessible remotely, and difficult to manage without technical expertise.
2. **Context**: With the increase in digital transformation, libraries need a simple and deployable solution that works efficiently even in constrained environments.
3. **Impact**: A cloud-ready, lightweight library management system can reduce operational overhead and improve data accessibility and management.

---

##  Project Objectives

1. Develop a web-based application to manage library operations (books, authors, categories).
2. Implement containerization using Docker for environment consistency and ease of deployment.
3. Use FastAPI to develop RESTful APIs and React for a modern user interface.
4. Integrate TinyDB for lightweight, JSON-based data persistence.

---

##  System Architecture

**System Layers:**

1. **Frontend**:

   * Developed using **React.js**, **typescript**
   * Provides user-friendly UI for CRUD operations on books, authors, and categories

2. **Backend**:

   * Built with **FastAPI**
   * Contains separate APIs for:

     * Author APIs
     * Book APIs
     * Category APIs
     * Utility APIs (bulk upload, filters, etc.)

3. **Database**:

   * **TinyDB**, a document-oriented database stored as a JSON file

4. **Deployment**:

   * **Dockerized** frontend and backend
   * Easily deployable using `docker-compose`

---

##  Technologies & Tools Used

###  Cloud Platform

* Localhost (Docker containers)

###  Programming Languages

* Python (FastAPI)
* JavaScript (React)

###  Databases

* TinyDB (local JSON-based DB)

###  Frameworks & Libraries

* FastAPI, Pydantic (Backend)
* React.js , typescript (Frontend)

###  DevOps & Deployment

* Docker (containerization)

###  APIs & Integration

* RESTful APIs

---

##  Implementation Highlights

1. Developed modular API files: `auth_and_book_apis.py`, `bulk_action_apis.py`, etc.
2. Used **FastAPI routers** to structure the backend cleanly.
3. Integrated **TinyDB** with serialization for flexible data storage.
4. Dockerized the backend and frontend to standardize environments.
5. Collaborated effectively across roles to separate concerns and accelerate development.

---

##  Testing & Validation

1. **Swagger UI** for API endpoint testing
2. **Manual Testing** using JSON payloads via Postman
3. **Validation** handled through Pydantic schemas
4. **Functional Testing** on Docker containers post-build

---

##  Results & Performance

* **Response Time**: < 100ms locally on most endpoints
* **Load**: Capable of handling multiple concurrent API calls
* **Cost**: Zero cost on deployment using TinyDB and Docker locally
* **Efficiency**: FastAPI + TinyDB ensures minimal startup and I/O delay

---


##  Future Enhancements

1. Replace TinyDB with PostgreSQL or MongoDB for scalability
2. Add authentication and role-based access control (RBAC)
3. Enhance UI with filtering, sorting, and search capabilities
4. CI/CD pipeline using GitHub Actions or Jenkins
5. Host on cloud (e.g., AWS EC2 or Render)

---

##  Acknowledgments

- **Team Members:** Active collaboration and contribution from all team members.
- **Resources Used:** Open-source documentation and tutorials from **FastAPI**, **Docker**, **React**, and **TinyDB**.


---

##  References

* [FastAPI Docs](https://fastapi.tiangolo.com/)
* [TinyDB Docs](https://tinydb.readthedocs.io/)
* [React Docs](https://reactjs.org/)
* [Docker Docs](https://docs.docker.com/)
* [Pydantic](https://docs.pydantic.dev/)

---

##  License

This project is developed for academic purposes. License details can be added here (MIT, Apache 2.0, etc.) if required.