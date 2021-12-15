
-- This view contains the number of books sold by author
-- If two authors wrote 1 book, each of those others
-- get a sale for that book
create view author_sales(author_id, total_book_sales) as(
    select author_id, sum(quantity)
    from wrote inner join order_object using (isbn)
    group by author_id
);

-- This view contains the number of books sold by genre
create view genre_sales(genre, total_book_sales) as(
    select genre, sum(quantity)
    from book inner join order_object using (isbn)
    group by genre
);

-- This view contains the number of books sold
-- for each day that an order was placed in the db
create view sales_by_date(order_date,total_book_sales) as(
    select order_date, sum (quantity)
    from order_object inner join user_order using (order_id)
    group by order_date
);

--  This view contains the number of EACH book that was sold
--  for each day
create view sales_by_date_book(order_date,total_book_sales,isbn) as(
    select order_date, sum (quantity), isbn
    from order_object inner join user_order using (order_id)
    group by order_date, isbn
);

