create table book
	(ISBN		varchar(17), 
	 title		varchar(100), 
	 genre		varchar(25),
     price      decimal(10,2),
     stock      integer check (stock >= 0),
     numPages   integer check (numPages > 0),
	 pubCut		decimal(4,2),
	 primary key (ISBN)
	);

