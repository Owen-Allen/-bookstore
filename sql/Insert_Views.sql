--might need to replace the from in total_sales with this. ask owen to test
create view author_orders(isbn,author_id, order_id,quantity) as(
    select isbn, author_id, order_id, quantity
    from wrote inner join order_object using (isbn)
)

create function total_sales(input_ID varchar(10))
  returns integer
  declare total_sales integer;
  select sum(quantity) into total_sales
    from wrote inner join order_object using (isbn) --might need to make this line into a view, as too many wheres could be a problem
    where isbn = input_ID
  return total_sales;
  end;

--feel like this is a better idea below
--we could also make a view that uses a group by
--a view that sums the quantity of books sold by their author_id 
create view author_sales(author_id, totalBookSales) as(
    select author_id, sum(quantity)
    from wrote inner join order_object using (isbn)
    group by author_id
)

--then you would select from that view with
select *
from author_sales
where author_id = 'someidhere'
