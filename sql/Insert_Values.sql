delete from published;
delete from wrote;
delete from order_object;
delete from user_order;
delete from author;
delete from publisher;
delete from book;
delete from user_account;

insert into book values('000000001','Isgramors Enchantments','Fiction',10.00, 100,259,0.5);
insert into book values('000000002','Henry Ducklewit: A Life of Pain','Autobiography',1002.00, 1020,29,0.25);
insert into book values('000000003','The Absurdly Inane Adventures of the Wonder Crew','History',10.00, 100,219,0.33);
insert into book values('000000004','Gonkies Guide to Getting Chonky','Self-Help',1.00, 610,132,0.57);
insert into book values('000000005','Grinkies Guide to Getting Slinky','Self-Help',5.00, 23,22,0.59);
insert into book values('000000006','Phineas & Ferb''s Funtime Adventures','Fiction',104.00, 32,259,0.5);

insert into user_account values('U0000001', 'Eric','123','Smith Street','Ottawa','ON','K1C3XL','123','Smith Street','Ottawa','ON','K1C3X6');
insert into user_account values('U0000002', 'John','4323','Bilson Street','Montreal','ON','Q1B3X2','4323','Bilson Street','Montreal','ON','Q1B3X2');
insert into user_account values('U0000003', 'Steve','2315','Lopsided Street','Ajax','ON','P1L2X2','2315','Lopsided Street','Ajax','ON','P1L2X2');
insert into user_account values('U0000004', 'Jenny','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0');

-- create table user_order (user_id, order_id, date 
-- cur_house_number,  cur_street,  cur_city ,  cur_province ,  cur_postal_code
-- bil_house_number ,  bil_street,  bil_city ,  bil_province ,  bil_postal_code 
-- str_house_number,  str_street,  str_city,  str_province,  str_postal_code
insert into user_order values('U0000001', '00000010','2021-11-26','124','Shipping Avenue','Bracebridge','QC','W3R3T3','123','Smith Street','Ottawa','ON','K1C3X6','123','Smith Street','Ottawa','ON','K1C3X6');
insert into user_order values('U0000002', '00000040','2021-11-25','124','Shipping Avenue','Bracebridge','QC','W3R3T3','4323','Bilson Street','Montreal','ON','Q1B3X2','4323','Bilson Street','Montreal','ON','Q1B3X2');
insert into user_order values('U0000003','00000020','2021-11-22','124','Shipping Avenue','Bracebridge','QC','W3R3T3','2315','Lopsided Street','Ajax','ON','P1L2X2','2315','Lopsided Street','Ajax','ON','P1L2X2');
insert into user_order values('U0000004','00000030','2021-11-23','124','Shipping Avenue','Bracebridge','QC','W3R3T3','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0');
insert into user_order values('U0000004','00000050','2021-11-28','124','Shipping Avenue','Bracebridge','QC','W3R3T3','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0','12313','Bronktonk Avenue','Bronksonville','ON','R1T6Y0');

--order_id, isbn, quantity
insert into order_object values('00000010','000000006',3); --Fiction
insert into order_object values('00000010','000000004', 2); --Self-Help
insert into order_object values('00000020', '000000004', 12); --Self-help
insert into order_object values('00000030','000000003',1); --History
insert into order_object values('00000040', '000000005', 4); --Self-Help
insert into order_object values('00000050', '000000002', 600); --Autobiography

-- insert into user_order values(

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
insert into wrote values('000000006', 'a123456789');
insert into wrote values('000000004','a909090909');
insert into wrote values('000000005', 'a909090909');
insert into wrote values('000000003', 'a098765432');
insert into wrote values('000000003', 'a123456789');

insert into publisher values('p3n1580085', 'Penguin Books');
insert into publisher values('p888777666', 'Annick Press');
insert into publisher values('p100101001', 'Hachette');
insert into publisher values('p009998872', 'HarperCollins');

-- ISBN, publisher_id
-- Phineas and Ferb.... Hachette
-- gonkies, Hachette
-- grinkies, Penguin
-- Absurdly Inane, Annick Press
insert into published values('000000006','p100101001');
insert into published values('000000004','p100101001');
insert into published values('000000005','p3n1580085');
insert into published values('000000003','p888777666');

