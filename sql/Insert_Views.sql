
--PART A: GETTING AUTHOR TOTAL SALES

--might need to replace the from in total_sales with this. ask owen to test
create view author_orders(isbn,author_id, order_id,quantity) as(
    select isbn, author_id, order_id, quantity
    from wrote inner join order_object using (isbn)
)

create function total_sales(input_ID varchar(10))
  returns integer
  declare total_sales integer;
    select sum(quantity) into total_sales
    from author_orders
    where isbn = input_ID
  return total_sales;
  end;

--feel like this is a better idea below
--we could also make a view that uses a group by
--a view that sums the quantity of books sold by their author_id 
create view author_sales(author_id, total_book_sales) as(
    select author_id, sum(quantity)
    from wrote inner join order_object using (isbn)
    group by author_id
)

--then you would select from that view with
select *
from author_sales
where author_id = 'someidhere'
--Think we need to add a period of time here


--PART B: Query sales by GENRE
create view genre_sales(genre, total_book_sales) as(
    select genre, sum(quantity)
    from book inner join order_object using (isbn)
    group by genre
)

--then you would select from that view with
select *
from genre_sales
where genre = 'somegenrehere'
--Think we need to add a period of time here



--PART C: Query all sales between a period of time.
create view sales_by_date(date,total_book_sales) as(
    select date, sum (quantity)
    from order_object
    group by date
)

--then we use a function to aggregate between two dates. DISCUSS WITH OWEN
create function sales_between_dates(date_start integer, date_end integer)
returns integer
declare total_sales integer;
    select sum(quantity) into total_sales
    from sales_by_date
    where date >= date_start and date <= date_end
return total_sales
end;

--we could add this date input to every function made so far.


