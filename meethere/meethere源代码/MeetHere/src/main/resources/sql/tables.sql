create table site( 
siteId int primary key auto_increment, 
name varchar(30) not null,
imagePath varchar(50), 
description varchar(300), 
location varchar(100), 
price double(5,1))
default charset = utf8; 

create table userInfo(
userId int primary key auto_increment,
username varchar(20) unique,
password varchar(100) not null,
roles varchar(30) not null,
email varchar(30),
telephone varchar(20))
default charset = utf8;

create table messages(
messageId int primary key auto_increment,
parentId int default 0,
userId int not null,
content varchar(510) not null,
time timestamp not null,
index (userId),
foreign key (userId) references userInfo(userId) ON DELETE CASCADE)
default charset = utf8;

create table news( 
newsId int primary key auto_increment, 
title varchar(100) not null, 
content varchar(1024) not null, 
imagePath varchar(50), 
releaseTime timestamp not null)
default charset = utf8;

create table orders( 
orderId int primary key auto_increment, 
userId int not null, 
siteId int not null, 
startTime timestamp not null default '2019-01-01 00:00:00', 
endTime timestamp not null default '2019-01-01 00:00:00', 
state smallint not null, 
index (userId), 
index (siteId), 
foreign key (userId) references userInfo(userId) ON DELETE CASCADE,
foreign key (siteId) references site(siteId) ON DELETE CASCADE)
default charset = utf8;


