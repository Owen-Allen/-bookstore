drop view if exists author_sales;
drop view if exists sales_by_date;
drop view if exists sales_by_date_book;
drop view if exists genre_sales;

drop function if exists book_sales_between_dates;
drop function if exists sales_between_dates;

drop table if exists published;
drop table if exists wrote;
drop table if exists order_object;
drop table if exists user_order;
drop table if exists author;
drop table if exists publisher;
drop table if exists book;
drop table if exists user_account;

-- create the book table
-- isbn is the primary key
-- ISBN cannot be null
create table book
	(isbn		varchar(17) UNIQUE NOT NULL, 
	 title		varchar(100), 
	 genre		varchar(25),
     price      decimal(10,2),
     stock      integer check (stock >= 0),
     num_pages   integer check (num_pages > 0),
	 pub_cut		decimal(4,2),
	 primary key (isbn)
);

-- create the user_account table
-- user_id is the primary key
-- user_id cannot be null
-- New accounts default to not being an admin
create table user_account
	(user_id varchar(10) UNIQUE NOT NULL,
	name varchar(100),
	isAdmin boolean DEFAULT FALSE,
	shipping_house_number varchar(8),
	shipping_street	varchar(50),
	shipping_city varchar(50),
	shipping_province varchar(50),
	shipping_postal_code varchar(6),
	billing_house_number varchar(8),
	billing_street	varchar(50),
	billing_city varchar(50),
	billing_province varchar(50),
	billing_postal_code varchar(6),
	primary key (user_id)
);

-- create the author table
-- author_id is the primary key
-- author_id cannot be null
create table author
	(author_id 		varchar(10) UNIQUE NOT NULL,
	name 			varchar(100),
	primary key(author_id)
);

-- create the publisher table
-- publisher_id is the primary key
-- publisher_id cannot be null
-- the bank account defaults to a bank account balance of 0 when a new publisher is inserted
create table publisher
	(publisher_id 	varchar(10) UNIQUE NOT NULL,
	name 			varchar(100),
	bank_account numeric(15,2) DEFAULT 0,
	primary key(publisher_id)
);

-- create the user_order table
-- order_id is the primary key
-- foreign key user_id is from user_account, when the account is deleted so is the record of their order
create table user_order
	(user_id		varchar(10) NOT NULL,
	order_id		varchar(10) UNIQUE NOT NULL,
	order_date      date,
	order_house_number varchar(8),
	order_street	varchar(50),
	order_city varchar(50),
	order_province varchar(50),
	order_postal_code varchar(6),
	billing_house_number varchar(8),
	billing_street	varchar(50),
	billing_city varchar(50),
	billing_province varchar(50),
	billing_postal_code varchar(6),	
	shipping_house_number varchar(8),
	shipping_street	varchar(50),
	shipping_city varchar(50),
	shipping_province varchar(50),
	shipping_postal_code varchar(6),
	primary key(order_id),
	foreign key (user_id) references user_account on delete cascade
);

-- create the order_object table
-- order_id and isbn form the primary key
-- the quantity of books defaults to 0
-- order_id is a foreign key from the user_order
-- isbn is a foreign key from book
create table order_object
	(order_id		varchar(10),
	isbn			varchar(17),
	quantity		int DEFAULT 0,
	primary key(order_id, isbn),
	foreign key (order_id) references user_order(order_id)
	ON DELETE CASCADE,
	foreign key (isbn) references book(isbn) 
	ON DELETE CASCADE
);


-- create the wrote table
-- author_id and isbn form the primary key
-- author_id is a foreign key from author
-- isbn is a foreign key from book
create table wrote
	(isbn		varchar(17),
	author_id   varchar(10),
	primary key (isbn, author_id),
	foreign key (author_id) references author
	ON DELETE CASCADE,
	foreign key (isbn) references book
	ON DELETE CASCADE
);

-- create the published table
-- isbn and publisher_id form the primary key
-- isbn is a foreign key from book
-- publisher_id is a foreign key from publisher
create table published
	(isbn		   varchar(17),
	publisher_id   varchar(10),
	primary key (isbn, 	publisher_id),
	foreign key (publisher_id) references publisher
	ON DELETE CASCADE,
	foreign key (isbn) references book
	ON DELETE CASCADE
);