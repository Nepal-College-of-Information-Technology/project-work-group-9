from Author.models import Author
from fastapi import FastAPI, HTTPException
from db import authors_table

app = FastAPI()


# POST method to create an order
@app.post("/authors/")
def create_author(author: Author):
    author_dict = author.__dict__()
    author_id = authors_table.insert(author_dict)
    return {"author_id": author_id, **author_dict}


# GET method to retrieve all orders
@app.get("/authors/")
def get_author():
    return authors_table.all()
