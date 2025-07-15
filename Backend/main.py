from fastapi import FastAPI
from authorsapi.crud_apis import router
from authorsapi.filter_and_search_apis import router2
from authorsapi.auth_and_book_apis import router3
from authorsapi.bulk_action_apis import router4
from categoriesapi.categories_api import router5
from booksapi.books_apis import router6
from utilityapi.utility_api import router7
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(router2)
app.include_router(router3)
app.include_router(router4)
app.include_router(router5)
app.include_router(router6)
app.include_router(router7)

