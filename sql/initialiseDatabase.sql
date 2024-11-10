-- 1) Check if tables exist and drop them
IF OBJECT_ID('dbo.memberEvent', 'U') IS NOT NULL
    DROP TABLE dbo.memberEvent;

IF OBJECT_ID('dbo.appointment', 'U') IS NOT NULL
    DROP TABLE dbo.appointment;

IF OBJECT_ID('dbo.member', 'U') IS NOT NULL
    DROP TABLE dbo.[member];

IF OBJECT_ID('dbo.event', 'U') IS NOT NULL
    DROP TABLE dbo.[event];

IF OBJECT_ID('dbo.admin', 'U') IS NOT NULL
    DROP TABLE dbo.admin;

-- 2) Create tables according to the ER diagram

CREATE TABLE [member] (
    memberID INT PRIMARY KEY IDENTITY(1,1),
    firstName NVARCHAR(100),
    lastName NVARCHAR(100),
    email NVARCHAR(100) UNIQUE,
    emailVC NVARCHAR(100),
    emailVCTimestamp DATETIME,
    contactNo NVARCHAR(20),
    contactNoVC NVARCHAR(100),
    contactNoVCTimestamp DATETIME,
    password NVARCHAR(100),
    profilePicture NVARCHAR(500),
    membershipEndDate DATETIME NULL
);

CREATE TABLE [event] (
    eventID INT PRIMARY KEY IDENTITY(1,1),
    type NVARCHAR(100), -- workshop, camp, or professional in full
    title NVARCHAR(200),
    price DECIMAL(10, 2),
    oldPrice DECIMAL(10, 2),
    classSize NVARCHAR(50), -- e.g., '15-20'
    duration NVARCHAR(50), -- e.g., '3.5 days'
    lunchProvided BIT, -- 0 = No, 1 = Yes
    lessonMaterialsProvided BIT, -- 0 = No, 1 = Yes
    accessToMembership BIT, -- 0 = No, 1 = Yes
    availableDates NVARCHAR(MAX), -- list of dates
    time NVARCHAR(50), -- e.g., '1pm-3pm', '10am-6pm'
    totalParticipants INT,
    venue NVARCHAR(500),
    picture NVARCHAR(500) -- Image path
);

CREATE TABLE memberEvent (
    memberEventID INT PRIMARY KEY IDENTITY(1,1), -- New unique primary key
    memberID INT,
    eventID INT,
    fullName NVARCHAR(100),
    age NVARCHAR(10),
    schoolName NVARCHAR(100),
    interests NVARCHAR(200),
    medicalConditions NVARCHAR(500),
    lunchOption NVARCHAR(100), 
    specifyOther NVARCHAR(200), 
    FOREIGN KEY (memberID) REFERENCES [member](memberID),
    FOREIGN KEY (eventID) REFERENCES [event](eventID)
);

CREATE TABLE admin (
    adminID INT PRIMARY KEY IDENTITY(1,1), 
    firstName NVARCHAR(100),
    lastName NVARCHAR(100),
    email NVARCHAR(100) UNIQUE,
    emailVC NVARCHAR(100),
    emailVCTimestamp DATETIME,
    contactNo NVARCHAR(20),
    contactNoVC NVARCHAR(100),
    contactNoVCTimestamp DATETIME,
    password NVARCHAR(100),
    profilePicture NVARCHAR(500),
    availability NVARCHAR(MAX), -- Stores availability data as JSON
    bio NVARCHAR(1000), -- New field to store a short biography
    calendlyLink NVARCHAR(500), -- New field for Calendly link
    calendlyAccessToken NVARCHAR(500) -- New field for Calendly access token

    
);

CREATE TABLE appointment (
    AppointmentID INT IDENTITY(1,1) PRIMARY KEY,
    MemberID INT,
    AdminID INT,
    startDateTime NVARCHAR(40),
    endDateTime NVARCHAR(40),
    ParticipantURL NVARCHAR(1000),
    HostRoomURL NVARCHAR(1000),
    FOREIGN KEY (MemberID) REFERENCES [member](memberID),
    FOREIGN KEY (AdminID) REFERENCES admin(adminID)
);
-- 3) Insert dummy data

-- Insert a dummy member with updated membershipEndDate
INSERT INTO [member] (firstName, lastName, email, emailVC, emailVCTimestamp, contactNo, contactNoVC, contactNoVCTimestamp, password, profilePicture, membershipEndDate)
VALUES 
('Mindsphere', 'Services', 'mindsphere.services@gmail.com', '123456', GETDATE(), '98765432', '654321', GETDATE(), 'password123', './img/misc/account-icon.png', NULL),
('Bob', 'Lee', 'bob.lee@gmail.com', '123456', GETDATE(), '91234568', '654322', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Charlie', 'Ng', 'charlie.ng@gmail.com', '123456', GETDATE(), '91234569', '654323', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Diana', 'Wong', 'diana.wong@gmail.com', '123456', GETDATE(), '91234570', '654324', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Ethan', 'Lim', 'ethan.lim@gmail.com', '123456', GETDATE(), '91234571', '654325', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Fiona', 'Chua', 'fiona.chua@gmail.com', '123456', GETDATE(), '91234572', '654326', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('George', 'Ong', 'george.ong@gmail.com', '123456', GETDATE(), '91234573', '654327', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Hannah', 'Teo', 'hannah.teo@gmail.com', '123456', GETDATE(), '91234574', '654328', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Ian', 'Tan', 'ian.tan@gmail.com', '123456', GETDATE(), '91234575', '654329', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Jasmine', 'Low', 'jasmine.low@gmail.com', '123456', GETDATE(), '91234576', '654330', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Kevin', 'Foo', 'kevin.foo@gmail.com', '123456', GETDATE(), '91234577', '654331', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Laura', 'Chan', 'laura.chan@gmail.com', '123456', GETDATE(), '91234578', '654332', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Michael', 'Tan', 'michael.tan@gmail.com', '123456', GETDATE(), '91234579', '654333', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Natalie', 'Goh', 'natalie.goh@gmail.com', '123456', GETDATE(), '91234580', '654334', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Oscar', 'Lim', 'oscar.lim@gmail.com', '123456', GETDATE(), '91234581', '654335', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Paula', 'Sim', 'paula.sim@gmail.com', '123456', GETDATE(), '91234582', '654336', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE())),
('Quincy', 'Ang', 'quincy.ang@gmail.com', '123456', GETDATE(), '91234583', '654337', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(YEAR, 1, GETDATE()));

-- Insert updated dummy events with corresponding images and updated fields
INSERT INTO [event] (type, title, price, oldPrice, classSize, duration, lunchProvided, lessonMaterialsProvided, accessToMembership, availableDates, time, totalParticipants, venue, picture)
VALUES 
-- Public Speaking Workshops (After 20 Nov to Before 30 Nov)
('Public Speaking Workshops', 'Beginner', 788.00, 988.00, '15-20', '3.5 days', 1, 1, 1, '2024-11-21,2024-11-22', '9am-5pm', 20, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/public-speaking-workshop.jpg'),
('Public Speaking Workshops', 'Intermediate', 988.00, 1188.00, '12-15', '3 days', 1, 1, 1, '2024-11-23,2024-11-25', '9am-5pm', 10, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/public-speaking-workshop.jpg'),
('Public Speaking Workshops', 'Advanced', 1388.00, 1388.00, '10', '3 days', 1, 1, 1, '2024-11-26,2024-11-28', '9am-5pm', 15, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/public-speaking-workshop.jpg'),

-- PSLE Power Up Camp (1 Dec to 31 Dec)
('PSLE Power Up Camp', 'PSLE Power Up', 200.00, 250.00, '50', '5 days', 1, 1, 1, '2024-11-01,2024-11-05', '10am-6pm', 12, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/psle-powerup-camp.jpg'),
('PSLE Power Up Camp', 'PSLE Chinese Oral Booster', 180.00, 220.00, '50', '3 days', 1, 1, 1, '2024-11-15,2024-11-18', '10am-6pm', 27, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/psle-powerup-camp.jpg'),

-- Professionals Workshops (Spread from Aug to Oct)
('Professionals', 'Train-The-Trainer Programme', 700.00, 350.00, '40', '2 days', 1, 1, 1, '2024-08-10,2024-08-12', '9am-5pm', 43, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Mastering the Art of Negotiation', 550.00, 400.00, '35', '1 day', 1, 1, 1, '2024-09-05', '9am-5pm', 25, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Time Mastery: Unlock Your Productive Potential', 600.00, 450.00, '40', '1 day', 1, 1, 1, '2024-09-15', '9am-5pm', 45, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'LinkedIn Makeover: Boost Your Personal Brand', 450.00, 300.00, '30', '1 day', 1, 1, 1, '2024-10-10', '9am-5pm', 72, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Client Relationships and Communication', 275.00, 325.00, '30', '1 day', 1, 1, 1, '2024-10-20', '9am-5pm', 35, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Leadership Development Workshop', 120.00, 370.00, '40', '2 days', 1, 1, 1, '2024-10-25,2024-10-27', '9am-5pm', 48, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg');

-- Insert updated dummy memberEvents
INSERT INTO memberEvent (memberID, eventID, fullName, age, schoolName, interests, medicalConditions, lunchOption, specifyOther)
VALUES 
(1, 1, 'John Doe', '12', 'NUS', 'Public Speaking', 'None', 'No Dietary Restrictions', ''),
(1, 2, 'John Doe', '12', 'NUS', 'Leadership', 'None', 'No Mango', ''),
(1, 4, 'John Doe', '12', 'NUS', 'Education', 'None', 'Vegan', 'Soy Milk Only'),

-- Additional Dummy Data with Restricted Interests and Event IDs
(2, 1, 'Alice Tan', '10', 'NTU', 'Travel', 'None', 'Vegetarian', 'Gluten-Free Bread'),
(2, 2, 'Bob Lee', '11', 'SMU', 'Technology', 'Asthma', 'No Seafood', ''),
(2, 3, 'Charlie Ng', '13', 'SUTD', 'Art', 'None', 'No Dairy', ''),
(2, 1, 'Diana Wong', '13', 'NUS', 'Cooking', 'Lactose Intolerant', 'Vegan', ''),
(2, 2, 'Ethan Lim', '11', 'SIM', 'Sports', 'Peanut Allergy', 'No Nuts', 'Soy Milk Only'),
(3, 3, 'Fiona Chua', '9', 'NUS', 'Nature', 'None', 'No Dietary Restrictions', ''),
(3, 1, 'George Ong', '10', 'NTU', 'Travel', 'Asthma', 'Vegan', ''),
(3, 2, 'Hannah Teo', '13', 'SMU', 'Technology', 'None', 'No Mango', ''),
(4, 3, 'Ian Tan', '12', 'SUTD', 'Art', 'None', 'Vegetarian', 'Gluten-Free Bread'),
(4, 1, 'Jasmine Low', '13', 'NUS', 'Cooking', 'Lactose Intolerant', 'Vegan', ''),
(4, 2, 'Kevin Foo', '11', 'SIM', 'Sports', 'Peanut Allergy', 'No Nuts', 'Soy Milk Only'),
(4, 3, 'Laura Chan', '10', 'NUS', 'Nature', 'None', 'No Dietary Restrictions', ''),
(2, 1, 'Michael Tan', '12', 'NTU', 'Travel', 'Asthma', 'Vegan', ''),
(5, 2, 'Natalie Goh', '13', 'SMU', 'Technology', 'None', 'No Mango', ''),
(2, 3, 'Oscar Lim', '11', 'SUTD', 'Art', 'None', 'Vegetarian', 'Gluten-Free Bread'),
(3, 1, 'Paula Sim', '9', 'NUS', 'Cooking', 'None', 'Vegan', ''),
(5, 2, 'Quincy Ang', '10', 'SIM', 'Sports', 'None', 'No Nuts', ''),
(5, 3, 'Rachel Yeo', '13', 'NUS', 'Nature', 'None', 'No Dairy', ''),
(5, 1, 'Steven Lee', '11', 'NTU', 'Art', 'Asthma', 'Vegetarian', 'Soy Milk Only'),
(5, 2, 'Tina Ho', '12', 'SMU', 'Cooking', 'Lactose Intolerant', 'Vegan', ''),
(6, 1, 'Aaron Lim', '12', 'NUS', 'Public Speaking', 'Asthma', 'Vegan', 'Soy Milk Only'),
(6, 2, 'Beatrice Tan', '9', 'NTU', 'Art', 'None', 'No Dairy', ''),
(6, 3, 'Caleb Ng', '11', 'SMU', 'Technology', 'Peanut Allergy', 'No Nuts', ''),
(6, 1, 'Denise Chua', '10', 'SIM', 'Cooking', 'Lactose Intolerant', 'Vegetarian', 'Gluten-Free Bread'),
(6, 2, 'Elliot Lee', '13', 'SUTD', 'Nature', 'None', 'No Mango', ''),
(6, 3, 'Faye Wong', '11', 'NUS', 'Leadership', 'Asthma', 'No Seafood', ''),
(7, 1, 'Grace Tan', '10', 'NTU', 'Travel', 'None', 'No Dietary Restrictions', ''),
(7, 2, 'Hugo Lim', '12', 'SMU', 'Education', 'None', 'Vegan', 'Soy Milk Only'),
(7, 3, 'Iris Chua', '9', 'SIM', 'Sports', 'None', 'No Nuts', ''),
(7, 1, 'Jason Ong', '13', 'SUTD', 'Art', 'Asthma', 'Vegetarian', ''),
(7, 2, 'Karen Low', '11', 'NUS', 'Cooking', 'None', 'No Dairy', ''),
(8, 3, 'Leo Foo', '12', 'NTU', 'Technology', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread'),
(8, 1, 'Mona Tan', '9', 'SMU', 'Travel', 'None', 'No Mango', ''),
(8, 2, 'Nathan Lee', '10', 'SIM', 'Nature', 'None', 'Vegan', ''),
(8, 3, 'Olivia Lim', '13', 'SUTD', 'Public Speaking', 'Asthma', 'No Seafood', ''),
(9, 1, 'Paul Sim', '11', 'NUS', 'Education', 'None', 'No Dietary Restrictions', ''),
(9, 2, 'Queenie Foo', '10', 'NTU', 'Art', 'None', 'No Mango', ''),
(9, 3, 'Ryan Ng', '12', 'SMU', 'Sports', 'Lactose Intolerant', 'Vegetarian', 'Soy Milk Only'),
(10, 1, 'Samantha Lee', '9', 'SIM', 'Leadership', 'None', 'No Dairy', ''),
(10, 2, 'Timothy Tan', '13', 'SUTD', 'Cooking', 'None', 'Vegan', ''),
(6, 4, 'Aaron Lim', '12', 'NUS', 'Public Speaking', 'Asthma', 'Vegan', 'Soy Milk Only'),
(6, 5, 'Beatrice Tan', '9', 'NTU', 'Art', 'None', 'No Dairy', ''),
(6, 6, 'Caleb Ng', '11', 'SMU', 'Technology', 'Peanut Allergy', 'No Nuts', ''),
(6, 7, 'Denise Chua', '10', 'SIM', 'Cooking', 'Lactose Intolerant', 'Vegetarian', 'Gluten-Free Bread'),
(6, 8, 'Elliot Lee', '13', 'SUTD', 'Nature', 'None', 'No Mango', ''),
(6, 9, 'Faye Wong', '11', 'NUS', 'Leadership', 'Asthma', 'No Seafood', ''),
(6, 10, 'Grace Tan', '12', 'NTU', 'Travel', 'None', 'No Dietary Restrictions', ''),
(6, 11, 'Hugo Lim', '9', 'SMU', 'Education', 'None', 'Vegan', 'Soy Milk Only'),
(7, 4, 'Iris Chua', '10', 'SIM', 'Sports', 'None', 'No Nuts', ''),
(7, 5, 'Jason Ong', '13', 'SUTD', 'Art', 'Asthma', 'Vegetarian', ''),
(7, 6, 'Karen Low', '11', 'NUS', 'Cooking', 'None', 'No Dairy', ''),
(7, 7, 'Leo Foo', '12', 'NTU', 'Technology', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread'),
(7, 8, 'Mona Tan', '9', 'SMU', 'Travel', 'None', 'No Mango', ''),
(7, 9, 'Nathan Lee', '10', 'SIM', 'Nature', 'None', 'Vegan', ''),
(7, 10, 'Olivia Lim', '13', 'SUTD', 'Public Speaking', 'Asthma', 'No Seafood', ''),
(7, 11, 'Paul Sim', '11', 'NUS', 'Education', 'None', 'No Dietary Restrictions', ''),
(8, 4, 'Queenie Foo', '10', 'NTU', 'Art', 'None', 'No Mango', ''),
(8, 5, 'Ryan Ng', '12', 'SMU', 'Sports', 'Lactose Intolerant', 'Vegetarian', 'Soy Milk Only'),
(8, 6, 'Samantha Lee', '9', 'SIM', 'Leadership', 'None', 'No Dairy', ''),
(8, 7, 'Timothy Tan', '13', 'SUTD', 'Cooking', 'None', 'Vegan', ''),
(8, 8, 'Uma Chua', '11', 'NUS', 'Travel', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread'),
(8, 9, 'Vera Lim', '12', 'NTU', 'Technology', 'None', 'No Dietary Restrictions', ''),
(8, 10, 'Wendy Ong', '9', 'SMU', 'Nature', 'Asthma', 'Vegan', ''),
(8, 11, 'Xander Low', '13', 'SIM', 'Art', 'None', 'Vegetarian', ''),
(9, 4, 'Yvonne Tan', '10', 'SUTD', 'Public Speaking', 'None', 'No Mango', ''),
(9, 5, 'Zachary Lee', '11', 'NUS', 'Cooking', 'Lactose Intolerant', 'Vegetarian', 'Soy Milk Only'),
(9, 6, 'Abigail Wong', '12', 'NTU', 'Education', 'None', 'No Dairy', ''),
(9, 7, 'Brandon Ng', '13', 'SMU', 'Travel', 'Asthma', 'No Seafood', ''),
(9, 8, 'Cassandra Sim', '9', 'SIM', 'Sports', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread'),
(9, 9, 'Daniel Foo', '10', 'SUTD', 'Technology', 'None', 'Vegan', ''),
(9, 10, 'Elaine Ong', '12', 'NUS', 'Leadership', 'None', 'No Dietary Restrictions', ''),
(9, 11, 'Frank Low', '13', 'NTU', 'Art', 'None', 'Vegetarian', 'Soy Milk Only'),
(10, 4, 'Gina Tan', '9', 'SMU', 'Nature', 'Asthma', 'Vegan', ''),
(10, 5, 'Henry Ng', '10', 'SIM', 'Public Speaking', 'None', 'No Mango', ''),
(10, 6, 'Isabelle Foo', '12', 'SUTD', 'Cooking', 'None', 'Vegetarian', 'Gluten-Free Bread'),
(10, 7, 'Jack Ong', '13', 'NUS', 'Education', 'None', 'No Dairy', ''),
(10, 8, 'Kim Lee', '11', 'NTU', 'Travel', 'None', 'No Nuts', ''),
(10, 9, 'Liam Tan', '10', 'SMU', 'Sports', 'None', 'No Mango', ''),
(10, 10, 'Megan Low', '12', 'SIM', 'Technology', 'Lactose Intolerant', 'Vegetarian', ''),
(10, 11, 'Noah Sim', '13', 'SUTD', 'Leadership', 'Peanut Allergy', 'Vegan', ''),
(10, 4, 'Olive Ng', '9', 'NUS', 'Nature', 'None', 'No Dietary Restrictions', ''),
(10, 5, 'Peter Tan', '10', 'NTU', 'Art', 'Asthma', 'No Mango', ''),
(10, 6, 'Quinn Lim', '11', 'SMU', 'Travel', 'None', 'Vegetarian', 'Soy Milk Only'),
(10, 7, 'Riley Foo', '12', 'SIM', 'Cooking', 'None', 'No Dairy', ''),
(10, 8, 'Seth Lee', '13', 'SUTD', 'Technology', 'None', 'No Nuts', ''),
(10, 9, 'Tina Ong', '9', 'NUS', 'Sports', 'Asthma', 'Vegan', ''),
(10, 10, 'Uma Tan', '10', 'NTU', 'Public Speaking', 'None', 'No Mango', '');;


-- Insert a dummy admin data with updated availability format
INSERT INTO admin (firstName, lastName, email, emailVC, emailVCTimestamp, contactNo, contactNoVC, contactNoVCTimestamp, password, profilePicture, availability, bio, calendlyLink, calendlyAccessToken) 
VALUES 
    (
        'Simon', 
        'Yio', 
        'simon.mindsphere@gmail.com', 
        '654321', 
        GETDATE(), 
        '91234567', 
        '123456', 
        GETDATE(), 
        'abc123', 
        './img/coach/Simon.jpeg', 
        NULL,
        'Experienced coach in business and leadership.',
        'https://calendly.com/simon-mindsphere/1-1-executive-coaching',
        'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzMwMjk1Njc0LCJqdGkiOiI5N2RjZTZlOS1kNzRhLTRjNjEtODU4OS1jYTNkZDZmZjJlZWIiLCJ1c2VyX3V1aWQiOiIyOTM1Y2ZlOC1jOTExLTQxNTAtODEzOS0zOTVlZjFiMjIyYTUifQ.bPLZUqYY4FFtx54rNwBXyd8JMC2U3fXrSXTYeO42nOokj-X-EeBuS_BLaOAGn-1wdfvJ37oW2mP-u3t0ZBQzEg'
    ),
    (
    'Christine', 
    'Chua', 
    'mindsphere.services@gmail.com', 
    '654321', 
    GETDATE(), 
    '91234567', 
    '123456', 
    GETDATE(), 
    'adminpass123', 
    '/img/coach/Christine.jpeg', 
    '[{"utcDateTime": "2024-10-31T09:00:00.000Z"}, {"utcDateTime": "2024-10-31T11:00:00.000Z"}, {"utcDateTime": "2024-11-01T09:00:00.000Z"}, {"utcDateTime": "2024-11-01T11:00:00.000Z"}, {"utcDateTime": "2024-11-07T09:00:00.000Z"}, {"utcDateTime": "2024-11-07T11:00:00.000Z"}, {"utcDateTime": "2024-11-08T09:00:00.000Z"}, {"utcDateTime": "2024-11-08T11:00:00.000Z"}, {"utcDateTime": "2024-11-14T09:00:00.000Z"}, {"utcDateTime": "2024-11-14T11:00:00.000Z"}, {"utcDateTime": "2024-11-15T09:00:00.000Z"}, {"utcDateTime": "2024-11-15T11:00:00.000Z"}]  
    ',
    'Talent development leader in FinTech.',
    'https://calendly.com/christine-mindsphere/1-1-executive-coaching',
    'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzMwMzEyNDMyLCJqdGkiOiJhNDJmMDExMC02NmM1LTQwMzgtOTU0Ny04ZDZiNTgwZmIyZjAiLCJ1c2VyX3V1aWQiOiIzMWIyYWYyZC1jZmFiLTQwNTgtYjQxNy1hYzE2NjAzY2VjNzkifQ.q1bMc94syvDmQwvApqmUUSPgVC4xR7P8XC6l8LYC8kbCYK38nbL9Do1iCuWVlZa6GvrNyD9mrGjoZOttLktytw'
);

-- 4) Select all tables
SELECT * FROM [member];
SELECT * FROM [event];
SELECT * FROM memberEvent;
SELECT * FROM admin;
SELECT * FROM appointment;
