-- 1) Check if tables exist and drop them
IF OBJECT_ID('dbo.memberEvent', 'U') IS NOT NULL
    DROP TABLE dbo.memberEvent;
    
IF OBJECT_ID('dbo.member', 'U') IS NOT NULL
    DROP TABLE dbo.[member];

IF OBJECT_ID('dbo.event', 'U') IS NOT NULL
    DROP TABLE dbo.[event];

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
    profilePicture NVARCHAR(500)
);

CREATE TABLE [event] (
    eventID INT PRIMARY KEY IDENTITY(1,1),
    type NVARCHAR(50), -- workshop, camp, or professional
    title NVARCHAR(200),
    price DECIMAL(10, 2),
    duration NVARCHAR(50), -- e.g. '3.5 days', '3 hours'
    availableDates NVARCHAR(MAX), -- list of dates
    time NVARCHAR(50), -- e.g. '1pm-3pm', '10am-6pm'
    totalParticipants INT,
    venue NVARCHAR(500)
);

CREATE TABLE memberEvent (
    memberID INT,
    eventID INT,
    PRIMARY KEY (memberID, eventID),
    FOREIGN KEY (memberID) REFERENCES [member](memberID),
    FOREIGN KEY (eventID) REFERENCES [event](eventID)
);

-- 3) Insert dummy data

-- Insert a dummy member
INSERT INTO [member] (firstName, lastName, email, emailVC, emailVCTimestamp, contactNo, contactNoVC, contactNoVCTimestamp, password, profilePicture)
VALUES ('John', 'Doe', 'john.doe@example.com', '123456', GETDATE(), '98765432', '654321', GETDATE(), 'password123', NULL);

-- Insert dummy events
INSERT INTO [event] (type, title, price, duration, availableDates, time, totalParticipants, venue)
VALUES 
('workshop', 'Beginner', 50.00, '3.5 days', '2024-11-01,2024-11-05', '9am-5pm', 30, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('workshop', 'Intermediate', 100.00, '2 days', '2024-12-01,2024-12-02', '9am-5pm', 25, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('workshop', 'Advanced', 150.00, '1 day', '2024-12-15', '9am-5pm', 20, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('camp', 'PSLE Power Up', 200.00, '5 days', '2024-11-10,2024-11-15', '10am-6pm', 50, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('camp', 'PSLE Chinese Oral Booster', 180.00, '3 days', '2024-11-20,2024-11-23', '10am-6pm', 50, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('professional', 'Train-The-Trainer Programme', 300.00, '2 days', '2024-12-05,2024-12-06', '9am-5pm', 40, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('professional', 'Mastering the Art of Negotiation', 350.00, '1 day', '2024-12-10', '9am-5pm', 35, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501'),
('professional', 'Time Mastery: Unlock Your Productive Potential', 400.00, '1 day', '2024-12-12', '9am-5pm', 40, '60 Paya Lebar Road, #07-54 Paya Lebar Square, Singapore 409501');

-- Insert dummy memberEvents
INSERT INTO memberEvent (memberID, eventID)
VALUES 
(1, 1), -- John Doe attends 'Beginner' workshop
(1, 2), -- John Doe attends 'Intermediate' workshop
(1, 4); -- John Doe attends 'PSLE Power Up' camp

-- 4) Select all tables
SELECT * FROM [member];
SELECT * FROM [event];
SELECT * FROM memberEvent;
