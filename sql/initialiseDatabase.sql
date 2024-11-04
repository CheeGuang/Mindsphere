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
VALUES ('Mindsphere', 'Services', 'mindsphere.services@gmail.com', '123456', GETDATE(), '98765432', '654321', GETDATE(), 'password123', './img/misc/account-icon.png', NULL);
-- Insert dummy events with corresponding images and updated fields
INSERT INTO [event] (type, title, price, oldPrice, classSize, duration, lunchProvided, lessonMaterialsProvided, accessToMembership, availableDates, time, totalParticipants, venue, picture)
VALUES 
('Public Speaking Workshops', 'Beginner', 788.00, 988.00, '15-20', '3.5 days', 1, 1, 1, '2024-11-01,2024-11-05', '9am-5pm', 30, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/public-speaking-workshop.jpg'),
('Public Speaking Workshops', 'Intermediate', 988.00, 1188.00, '12-15', '3 days', 1, 1, 1, '2024-12-01,2024-12-02', '9am-5pm', 25, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/public-speaking-workshop.jpg'),
('Public Speaking Workshops', 'Advanced', 1388.00, 1388.00, '10', '3 days', 1, 1, 1, '2024-12-15', '9am-5pm', 20, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/public-speaking-workshop.jpg'),
('PSLE Power Up Camp', 'PSLE Power Up', 200.00, 250.00, '50', '5 days', 1, 1, 1, '2024-11-10,2024-11-15', '10am-6pm', 50, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/psle-powerup-camp.jpg'),
('PSLE Power Up Camp', 'PSLE Chinese Oral Booster', 180.00, 220.00, '50', '3 days', 1, 1, 1, '2024-11-20,2024-11-23', '10am-6pm', 50, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/psle-powerup-camp.jpg'),
('Professionals', 'Train-The-Trainer Programme', 300.00, 350.00, '40', '2 days', 1, 1, 1, '2024-12-05,2024-12-06', '9am-5pm', 40, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/professionals.jpg'),
('Professionals', 'Mastering the Art of Negotiation', 350.00, 400.00, '35', '1 day', 1, 1, 1, '2024-12-10', '9am-5pm', 35, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/professionals.jpg'),
('Professionals', 'Time Mastery: Unlock Your Productive Potential', 400.00, 450.00, '40', '1 day', 1, 1, 1, '2024-12-12', '9am-5pm', 40, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/professionals.jpg'),
('Professionals', 'LinkedIn Makeover: Boost Your Personal Brand', 250.00, 300.00, '30', '1 day', 1, 1, 1, '2024-12-15', '9am-5pm', 30, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/professionals.jpg'),
('Professionals', 'Client Relationships and Communication', 275.00, 325.00, '30', '1 day', 1, 1, 1, '2024-12-18', '9am-5pm', 30, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/professionals.jpg'),
('Professionals', 'Leadership Development Workshop', 320.00, 370.00, '40', '2 days', 1, 1, 1, '2024-12-20,2024-12-21', '9am-5pm', 40, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501', './img/workshop/professionals.jpg');

-- Insert updated dummy memberEvents
INSERT INTO memberEvent (memberID, eventID, fullName, age, schoolName, interests, medicalConditions, lunchOption, specifyOther)
VALUES 
(1, 1, 'John Doe', '35', 'NUS', 'Public Speaking', 'None', 'No Dietary Restrictions', ''),
(1, 2, 'John Doe', '35', 'NUS', 'Leadership', 'None', 'No Mango', ''),
(1, 4, 'John Doe', '35', 'NUS', 'Education', 'None', 'Vegan', 'Soy Milk Only');

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


-- Insert a dummy appointment data
INSERT INTO appointment (MemberID, AdminID, startDateTime, endDateTime, ParticipantURL, HostRoomURL)
VALUES (1, 1, '2024-11-07T09:00:00.000Z', '2024-11-07T10:00:00.000Z', 'https://example.com/patient/johndoe', 'https://example.com/host/room123');

-- 4) Select all tables
SELECT * FROM [member];
SELECT * FROM [event];
SELECT * FROM memberEvent;
SELECT * FROM admin;
SELECT * FROM appointment;
