-- FUNCTIONS

--  This function returns the number of sales between 2 dates
CREATE OR REPLACE FUNCTION sales_between_dates(date_start date, date_end date)
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

--  This function returns the number of sales for a book (specified by isbn)
--  between a given date range
CREATE OR REPLACE FUNCTION book_sales_between_dates(date_start date, date_end date, isbn_to_check varchar(10))
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

DROP TRIGGER IF EXISTS calculate_publisher_cut ON order_object;
DROP TRIGGER IF EXISTS place_order ON order_object;


-- This function adds to the publisher.bank_account attribute
-- the amount added is the change in stock amount, multiplied by the price and pub_cut
-- for the affected book
CREATE OR REPLACE FUNCTION pay_publisher()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS $$
	BEGIN
		IF ((OLD.stock - NEW.stock) > 0) THEN
			UPDATE publisher
				SET bank_account = bank_account + (OLD.stock - NEW.stock) * NEW.pub_cut * NEW.price
				WHERE publisher.publisher_id IN (SELECT publisher_id FROM book NATURAL JOIN published
												WHERE ISBN = NEW.ISBN);
		END IF;
		RETURN NEW;
	END;
	$$;

-- This trigger activates everytime book is updated
-- Call pay_publisher for each updated row
-- This will be implicitely triggered by place_order / order_books()
CREATE TRIGGER calculate_publisher_cut
	AFTER UPDATE
	ON book
	FOR EACH ROW
		EXECUTE PROCEDURE pay_publisher();

-- Decreases the stock of a specific book
-- by the quantity of books in the order (NEW)
-- IF stock dips below 10, order more books
CREATE OR REPLACE FUNCTION order_books()
	RETURNS TRIGGER
	LANGUAGE plpgsql
	AS $$
	BEGIN
	-- Update the stock
		UPDATE book
		SET stock = stock - NEW.quantity
		WHERE NEW.ISBN = book.ISBN;
	-- Check if the stock dipped below 10
		UPDATE book
		SET stock = stock + book_sales_between_dates(CURRENT_DATE - 30, CURRENT_DATE, ISBN)
		WHERE NEW.ISBN = book.ISBN and book.stock < 10;
		RETURN NEW;
	END;
	$$;

-- This trigger is called everytime an insert is made
-- on order_object (The contents of a user's order)
-- call order_books for the affected row
CREATE TRIGGER place_order
	AFTER INSERT
	ON order_object
	FOR EACH ROW
		EXECUTE PROCEDURE order_books();
