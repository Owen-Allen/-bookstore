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

create table author
	(author_id 		varchar(10) UNIQUE NOT NULL,
	name 			varchar(100),
	primary key(author_id)
);

create table publisher
	(publisher_id 	varchar(10) UNIQUE NOT NULL,
	name 			varchar(100),
	bank_account numeric(15,2) DEFAULT 0,
	primary key(publisher_id)
);


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

create table wrote
	(isbn		varchar(17),
	author_id   varchar(10),
	primary key (isbn, author_id),
	foreign key (author_id) references author
	ON DELETE CASCADE,
	foreign key (isbn) references book
	ON DELETE CASCADE
);

create table published
	(isbn		   varchar(17),
	publisher_id   varchar(10),
	primary key (isbn, 	publisher_id),
	foreign key (publisher_id) references publisher
	ON DELETE CASCADE,
	foreign key (isbn) references book
	ON DELETE CASCADE
);