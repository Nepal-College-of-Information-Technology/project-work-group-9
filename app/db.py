from tinydb import TinyDB, Query

db = TinyDB('db.json')
authors_table = db.table('authors')
categories_table = db.table('categories') 
books_table = db.table("books")
