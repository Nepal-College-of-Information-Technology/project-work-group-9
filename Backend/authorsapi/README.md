[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/trwb_8GS)

# Author Management API with FastAPI and TinyDB

This section is a simple RESTful API to manage authors and their books using FastAPI and TinyDB. It supports creating, reading, updating, and deleting authors, as well as retrieving book summaries and author statistics.

---

## Features

- CRUD operations on authors  
- Nested book data for each author  
- Search authors by name  
- Get all books by an author  
- Get author summary (age, books, etc.)  
- Get author statistics (book count, average rating)  
- Bulk create authors  
- Export authors data as JSON or CSV

---

## Technologies Used

- **FastAPI**: For building the API  
- **TinyDB**: Lightweight NoSQL database for data storage  
- **Pydantic**: Data validation and serialization  
- **Uvicorn**: ASGI server to run FastAPI

---

## Setup

### Requirements

- Python 3.8+  
- See `requirements.txt` for Python dependencies

### Install dependencies

```bash
pip install -r requirements.txt
