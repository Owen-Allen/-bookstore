
create view author_sales(author_id, total_book_sales) as(
    select author_id, sum(quantity)
    from wrote inner join order_object using (isbn)
    group by author_id
);


create view genre_sales(genre, total_book_sales) as(
    select genre, sum(quantity)
    from book inner join order_object using (isbn)
    group by genre
);


create view sales_by_date(order_date,total_book_sales) as(
    select order_date, sum (quantity)
    from order_object inner join user_order using (order_id)
    group by order_date
);

create view sales_by_date_book(order_date,total_book_sales,isbn) as(
    select order_date, sum (quantity), isbn
    from order_object inner join user_order using (order_id)
    group by order_date, isbn
);

