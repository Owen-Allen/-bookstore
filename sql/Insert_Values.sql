delete from published;
delete from wrote;
delete from order_object;
delete from user_order;
delete from author;
delete from publisher;
delete from book;
delete from user_account;

insert into book values('101102212','Isgramors Enchantments','Fiction',10.00, 100,259,0.5);
insert into book values('928182817','Henry Ducklewit: A Life of Pain','Autobiography',1002.00, 1020,29,0.25);
insert into book values('391913919','The Absurdly Inane Adventures of the Wonder Crew','History',10.00, 100,219,0.33);
insert into book values('480230880','Gonkies Guide to Getting Chonky','Self-Help',1.00, 610,132,0.57);
insert into book values('480230881','Grinkies Guide to Getting Slinky','Self-Help',5.00, 23,22,0.59);
insert into book values('382309203','Phineas & Ferb''s Funtime Adventures','Fiction',104.00, 32,259,0.5);

insert into user_account values('U1312311', 'Eric','123','Smith Street','Ottawa','ON','K1C3XL','123','Smith Street','Ottawa','ON','K1C3X6');
insert into user_account values('U9839480', 'John','4323','Bilson Street','Montreal','ON','Q1B3X2','4323','Bilson Street','Montreal','ON','Q1B3X2');
insert into user_account values('U75909221', 'Steve','2315','Lopsided Street','Ajax','ON','P1L2X2','2315','Lopsided Street','Ajax','ON','P1L2X2');
insert into user_account values('U85782902', 'Jenny','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0');

--    create table user_order (user_id, order_id, 
--cur_house_number,  cur_street,  cur_city ,  cur_province ,  cur_postal_code ,
-- bil_house_number ,  bil_street,  bil_city ,  bil_province ,  bil_postal_code, 
-- str_house_number,  str_street,  str_city,  str_province,  str_postal_code,
insert into user_order values('U1312311', '84378272','124','Shipping Avenue','Bracebridge','QC','W3R3T3','123','Smith Street','Ottawa','ON','K1C3XL','123','Smith Street','Ottawa','ON','K1C3XL');
insert into user_order values('U9839480', '12378452','124','Shipping Avenue','Bracebridge','QC','W3R3T3','4323','Bilson Street','Montreal','ON','Q1B3X2','4323','Bilson Street','Montreal','ON','Q1B3X2');
insert into user_order values('U75909221','18612784','124','Shipping Avenue','Bracebridge','QC','W3R3T3','2315','Lopsided Street','Ajax','ON','P1L2X2','2315','Lopsided Street','Ajax','ON','P1L2X2');
insert into user_order values('U85782902','18834573','124','Shipping Avenue','Bracebridge','QC','W3R3T3','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0');

insert into author values('a909090909', 'Robert Munch');
insert into author values('a123456789', 'Jimmy Neutron');
insert into author values('a098765432', 'Garbonzo');
insert into author values('a001000001', 'Erin Aaron');

-- ISBN, author_id
-- Phineas and Ferb, Jimmy Neutron
-- Grinkies, Robert Munch
-- Gronkies, Robert Munch
-- The Absurdly Inane..., Garbonzo
-- The Absurdly Inande..., Jimmy Neutron
insert into wrote values('382309203', 'a123456789');
insert into wrote values('480230880','a909090909');
insert into wrote values('480230881', 'a909090909');
insert into wrote values('391913919', 'a098765432');
insert into wrote values('391913919', 'a123456789');

insert into publisher values('p3n1580085', 'Penguin Books');
insert into publisher values('p888777666', 'Annick Press');
insert into publisher values('p100101001', 'Hachette');
insert into publisher values('p009998872', 'HarperCollins');

-- ISBN, publisher_id
-- Phineas and Ferb.... Hachette
-- Grinkies, Hachette
-- Gronkies, Penguin
-- Absurdly Inane, Annick Press
insert into published values('382309203','p100101001');
insert into published values('480230880','p100101001');
insert into published values('480230881','p3n1580085');
insert into published values('391913919','p888777666');