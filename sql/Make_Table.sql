drop table published;
drop table wrote;
drop table order_object;
drop table user_order;
drop table author;
drop table publisher;
drop table book;
drop table user_account;

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
	primary key(publisher_id)
);


create table user_order
	(user_id		varchar(10) NOT NULL,
	order_id		varchar(10) UNIQUE NOT NULL,
	current_house_number varchar(8),
	current_street	varchar(50),
	current_city varchar(50),
	current_province varchar(50),
	current_postal_code varchar(6),
	billing_house_number varchar(8),
	billing_street	varchar(50),
	billing_city varchar(50),
	billing_province varchar(50),
	billing_postal_code varchar(6),	
	destination_house_number varchar(8),
	destination_street	varchar(50),
	destination_city varchar(50),
	destination_province varchar(50),
	destination_postal_code varchar(6),
	primary key(user_id,order_id),
	foreign key (user_id) references user_account	
);

create table order_object
	(order_id		varchar(10),
	isbn			varchar(17),
	quantity		int DEFAULT 0,
	primary key(order_id, isbn),
	foreign key (order_id) references user_order(order_id),
	foreign key (isbn) references book(isbn)
);

create table wrote
	(isbn		varchar(17),
	author_id   varchar(10),
	primary key (isbn, author_id),
	foreign key (author_id) references author,
	foreign key (isbn) references book
);

create table published
	(isbn		   varchar(17),
	publisher_id   varchar(10),
	primary key (isbn, 	publisher_id),
	foreign key (publisher_id) references publisher,
	foreign key (isbn) references book
);