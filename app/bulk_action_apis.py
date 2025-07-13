from fastapi import APIRouter
from typing import List
from app.models import Author
from app.db import authors_table
import csv
import json
from fastapi.responses import StreamingResponse
from io import StringIO

router4 = APIRouter()


# Add a bulk create authors
@router4.post("/authors/bulk/")
def bulk_create_authors(authors: List[Author]):
    inserted_authors = []

    for author in authors:
        author_data = json.loads(author.model_dump_json())
        doc_id = authors_table.insert(author_data)
        inserted_authors.append({"author_id": doc_id, **author_data})

    return {"inserted": inserted_authors}

# Export as CSV as downloadable file
@router4.get("/authors/export/csv")
def export_authors_csv():
    authors = authors_table.all()

    if not authors:
        return {"message": "No authors to export"}

    output = StringIO()
    writer = csv.writer(output)

    headers = [
        "author_id", "first_name", "last_name", "bio",
        "date_of_birth", "date_of_death", "nationality",
        "created_at", "updated_at", "average_rating", "book_count", "books"
    ]
    writer.writerow(headers)

    for author in authors:
        books_str = "; ".join([book["title"] for book in author.get("books", [])])
        row = [
            author.get("author_id", ""),
            author.get("first_name", ""),
            author.get("last_name", ""),
            author.get("bio", ""),
            author.get("date_of_birth", ""),
            author.get("date_of_death", ""),
            author.get("nationality", ""),
            author.get("created_at", ""),
            author.get("updated_at", ""),
            author.get("average_rating", ""),
            author.get("book_count", ""),
            books_str
        ]
        writer.writerow(row)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=authors.csv"}
    )

