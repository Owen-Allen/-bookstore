-- FUNCTIONS

CREATE FUNCTION orderBooks(bookISBN varchar(17), numToOrder integer)
 	RETURNS book
 	language plpgsql
 	AS $$ 
 	declare
		result book;	
		BEGIN
		UPDATE book		
		SET stock = stock + numToOrder
		WHERE book.ISBN = bookISBN;
		SELECT * FROM book INTO result
		WHERE book.ISBN = bookISBN;
		RETURN result;
	END;
 	$$;

-- get all books from a specific order, and give us the book's information, while also having quantity ordered.

CREATE FUNCTION sales_between_dates(date_start date, date_end date)
	RETURNS integer
	language plpgsql
	AS $$ 
	declare
		total_sales integer;
	BEGIN
		select sum(total_book_sales) into total_sales
		from sales_by_date
		where order_date >= date_start and order_date <= date_end;
		return total_sales;
	END;
	$$;

CREATE FUNCTION book_sales_between_dates(date_start date, date_end date, isbn_to_check varchar(10))
	RETURNS integer
	language plpgsql
	AS $$ 
	declare
		total_sales integer;
	BEGIN
		select sum(total_book_sales) into total_sales
		from sales_by_date_book
		where order_date >= date_start and order_date <= date_end and isbn = isbn_to_check;
		return total_sales;
	END;
	$$;

--TRIGGERS

CREATE OR REPLACE FUNCTION subtract_stock()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS $$
	BEGIN
		UPDATE book
		SET stock = stock - NEW.quantity
		WHERE NEW.ISBN = book.ISBN;
		UPDATE book
		SET stock = stock + book_sales_between_dates(CURRENT_DATE - 30, CURRENT_DATE, ISBN)
		WHERE NEW.ISBN = book.ISBN and book.stock < 10;
		RETURN NEW;
	END;
	$$

CREATE TRIGGER place_order
	AFTER INSERT
	ON order_object
	FOR EACH ROW
		EXECUTE PROCEDURE subtract_stock();