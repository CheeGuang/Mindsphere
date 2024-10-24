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
    memberID INT,
    eventID INT,
    parentsConsent BIT, -- true or false
    dietaryOption NVARCHAR(100), -- noDietaryRestrictions, vegan, Dining Out, or remark
    paid BIT, -- true or false
    noOfParticipants INT, -- Number of participants attending
    PRIMARY KEY (memberID, eventID),
    FOREIGN KEY (memberID) REFERENCES [member](memberID),
    FOREIGN KEY (eventID) REFERENCES [event](eventID)
);

-- 3) Insert dummy data

-- Insert a dummy member
INSERT INTO [member] (firstName, lastName, email, emailVC, emailVCTimestamp, contactNo, contactNoVC, contactNoVCTimestamp, password, profilePicture)
VALUES ('John', 'Doe', 'john.doe@example.com', '123456', GETDATE(), '98765432', '654321', GETDATE(), 'password123', NULL);

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

-- Insert dummy memberEvents
INSERT INTO memberEvent (memberID, eventID, parentsConsent, dietaryOption, paid, noOfParticipants)
VALUES 
(1, 1, 0, 'No Dietary Restrictions', 1, 1), -- John Doe attends 'Beginner' workshop
(1, 2, 0, 'No Mango', 1, 1), -- John Doe attends 'Intermediate' workshop
(1, 4, 1, 'Vegan', 1, 2); -- John Doe attends 'PSLE Power Up' camp with 2 participants

-- 4) Select all tables
SELECT * FROM [member];
SELECT * FROM [event];
SELECT * FROM memberEvent;
