-- 1) Check if tables exist and drop them
IF OBJECT_ID('dbo.voucher', 'U') IS NOT NULL
    DROP TABLE dbo.voucher;

IF OBJECT_ID('dbo.referral', 'U') IS NOT NULL
    DROP TABLE dbo.referral;

IF OBJECT_ID('dbo.memberChild', 'U') IS NOT NULL
    DROP TABLE dbo.memberChild;

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

IF OBJECT_ID('dbo.child', 'U') IS NOT NULL
    DROP TABLE dbo.child;

IF OBJECT_ID('dbo.businessCollaboration', 'U') IS NOT NULL
    DROP TABLE dbo.businessCollaboration;

-- Drop the blogMeetUp table if it already exists
IF OBJECT_ID('dbo.blogMeetUp', 'U') IS NOT NULL
    DROP TABLE dbo.blogMeetUp;

IF OBJECT_ID('dbo.postUpvote', 'U') IS NOT NULL
    DROP TABLE dbo.postUpvote;

IF OBJECT_ID('dbo.blogComment', 'U') IS NOT NULL
    DROP TABLE dbo.blogComment;

IF OBJECT_ID('dbo.blogPost', 'U') IS NOT NULL
    DROP TABLE dbo.blogPost;

IF OBJECT_ID('dbo.blogCategory', 'U') IS NOT NULL
    DROP TABLE dbo.blogCategory;

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
    membershipEndDate DATETIME NULL,
    referralCode AS RIGHT('0000' + CONVERT(VARCHAR(6), memberID + 966200), 6) PERSISTED -- Computed column

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
    experience TINYINT CHECK (experience BETWEEN 1 AND 3), -- Experience rating (1-3)
    pace TINYINT CHECK (pace BETWEEN 1 AND 3),             -- Pace rating (1-3)
    liked NVARCHAR(500),                        -- Text for liked aspects
    disliked NVARCHAR(500),                     -- Text for disliked aspects
    additionalComments NVARCHAR(1000),          -- Additional comments
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

CREATE TABLE child (
    childID INT PRIMARY KEY IDENTITY(1,1),
    firstName NVARCHAR(100),
    lastName NVARCHAR(100),
    age INT,
    schoolName NVARCHAR(100),
    medicalConditions NVARCHAR(500),
    dietaryPreferences NVARCHAR(500),
    interests NVARCHAR(500)
);

CREATE TABLE memberChild (
    memberChildID INT PRIMARY KEY IDENTITY(1,1),
    memberID INT,
    childID INT,
    relationship NVARCHAR(100), -- e.g., "Parent", "Guardian"
    FOREIGN KEY (memberID) REFERENCES [member](memberID),
    FOREIGN KEY (childID) REFERENCES child(childID)
);

CREATE TABLE referral (
    referralID INT PRIMARY KEY IDENTITY(1,1),
    referrerID INT NOT NULL,
    refereeID INT NOT NULL,
    referralDate DATETIME DEFAULT GETDATE(),
    referrerRedeemed BIT DEFAULT 0, -- New column with default value 0
    referreeRedeemed BIT DEFAULT 0, -- New column with default value 0
    FOREIGN KEY (referrerID) REFERENCES [member](memberID),
    FOREIGN KEY (refereeID) REFERENCES [member](memberID),
    CONSTRAINT UQ_referrer_referee UNIQUE (referrerID, refereeID) -- Ensure 1-to-1 relationship
);

-- Create the voucher table with foreign key to member
CREATE TABLE voucher (
    voucherID INT PRIMARY KEY IDENTITY(1,1),
    memberID INT NOT NULL, -- Foreign key to member table
    value DECIMAL(10, 2) NOT NULL, -- Voucher value
    minimumSpend DECIMAL(10, 2) NOT NULL, -- Minimum spend required to use the voucher
    expiryDate DATETIME NOT NULL, -- Expiry date of the voucher
    redeemed BIT DEFAULT 0, -- Indicates if the voucher is redeemed (0 = Not redeemed, 1 = Redeemed)
    FOREIGN KEY (memberID) REFERENCES [member](memberID) -- Foreign key constraint
);

-- Create the businessCollaboration table
CREATE TABLE businessCollaboration (
    collaborationID INT PRIMARY KEY IDENTITY(1,1), -- Unique identifier for each collaboration
    businessName NVARCHAR(200) NOT NULL,          -- Name of the business
    contactNumber NVARCHAR(20) NOT NULL,          -- Business contact number
    businessEmail NVARCHAR(100) NOT NULL UNIQUE,  -- Business email (must be unique)
    requestedDate DATE NOT NULL,                  -- Date requested for collaboration
    requestedTime NVARCHAR(50) NOT NULL,          -- Time requested for collaboration
    venue NVARCHAR(500),                          -- Venue of the event
    description NVARCHAR(1000),                   -- Description of the collaboration
    participants INT,                              -- Number of participants
    lunchNeeded BIT DEFAULT 0,                    -- Indicates if lunch is needed (0 = No, 1 = Yes)
    createdAt DATETIME DEFAULT GETDATE(),         -- Record creation timestamp
    updatedAt DATETIME DEFAULT GETDATE()          -- Record last update timestamp
);

-- Create the blogCategory table
CREATE TABLE blogCategory (
    categoryID INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL -- Optional description for the category
);

-- Create the blogPost table
CREATE TABLE blogPost (
    postID INT PRIMARY KEY IDENTITY(1,1),
    memberID INT NOT NULL, -- Foreign key to the member table
    categoryID INT NOT NULL, -- Foreign key to the blogCategory table (1-to-1 relationship)
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NOT NULL, -- Full content of the blog post
    posterType NVARCHAR(10) NOT NULL, -- Either 'Parent' or 'Child'
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (memberID) REFERENCES [member](memberID),
    FOREIGN KEY (categoryID) REFERENCES blogCategory(categoryID)
);

-- Create the blogComment table
CREATE TABLE blogComment (
    commentID INT PRIMARY KEY IDENTITY(1,1),
    postID INT NOT NULL, -- Foreign key to the blogPost table
    memberID INT NOT NULL, -- Foreign key to the member table
    comment NVARCHAR(1000) NOT NULL, -- User's comment
    posterType NVARCHAR(10) NOT NULL, -- Either 'Parent' or 'Child'
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (postID) REFERENCES blogPost(postID),
    FOREIGN KEY (memberID) REFERENCES [member](memberID)
);

-- Create the postUpvote table
CREATE TABLE postUpvote (
    upvoteID INT PRIMARY KEY IDENTITY(1,1),
    postID INT NOT NULL, -- Foreign key to the blogPost table
    memberID INT NOT NULL, -- Foreign key to the member table
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (postID) REFERENCES blogPost(postID),
    FOREIGN KEY (memberID) REFERENCES [member](memberID),
    CONSTRAINT UQ_post_member UNIQUE (postID, memberID) -- Prevent duplicate upvotes by the same user
);

CREATE TABLE blogMeetUp (
    meetUpID INT PRIMARY KEY IDENTITY(1,1), -- Unique identifier for the meet-up event
    categoryID INT NOT NULL, -- Foreign key to blogCategory table
    title NVARCHAR(200) NOT NULL, -- Title of the meet-up event
    description NVARCHAR(MAX) NULL, -- Description of the meet-up
    isOnline BIT NOT NULL, -- 0 = In-person, 1 = Online
    startDateTime DATETIME NOT NULL, -- Start date and time of the meet-up
    endDateTime DATETIME NOT NULL, -- End date and time of the meet-up
    venue NVARCHAR(500) NULL, -- Venue of the meet-up (if in-person)
    link NVARCHAR(500) NOT NULL, -- Link to the meet-up or sign-up form
    createdAt DATETIME DEFAULT GETDATE(), -- Timestamp for when the meet-up was created
    FOREIGN KEY (categoryID) REFERENCES blogCategory(categoryID) -- Foreign key constraint
);


-- 3) Insert dummy data

-- Insert a dummy member with updated membershipEndDate
INSERT INTO [member] (firstName, lastName, email, emailVC, emailVCTimestamp, contactNo, contactNoVC, contactNoVCTimestamp, password, profilePicture, membershipEndDate)
VALUES 
('Jeffrey', 'Lee', 'mindsphere.services@gmail.com', '123456', GETDATE(), '98765432', '654321', GETDATE(), 'password123', './img/misc/account-icon.png', NULL),
('Sian Kim', 'Cing', 'jeffreylimtino@gmail.com', '123456', GETDATE(), '91234568', '654322', GETDATE(), 'password123', './img/misc/account-icon.png', DATEADD(DAY, 20, GETDATE())),
('Yee Hen', 'Ong', 'wallofflash@gmail.com', '123456', GETDATE(), '91234568', '654322', GETDATE(), 'password123', './img/misc/account-icon.png', NULL),
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
('Public Speaking Workshops', 'Beginner Public Speaking Workshops', 788.00, 988.00, '15-20', '3.5 days', 1, 1, 1, '2024-11-21,2024-11-22', '9am-5pm', 20, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/public-speaking-workshop.jpg'),
('Public Speaking Workshops', 'Intermediate Public Speaking Workshops', 988.00, 1188.00, '12-15', '3 days', 1, 1, 1, '2024-11-23,2024-11-25', '9am-5pm', 10, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/public-speaking-workshop.jpg'),
('Public Speaking Workshops', 'Advanced Public Speaking Workshops', 1388.00, 1388.00, '10', '3 days', 1, 1, 1, '2024-11-26,2024-11-28', '9am-5pm', 15, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/public-speaking-workshop.jpg'),

-- PSLE Power Up Camp (1 Dec to 31 Dec)
('PSLE Power Up Camp', 'PSLE Power Up', 200.00, 250.00, '50', '5 days', 1, 1, 1, '2024-11-01,2024-11-06', '10am-6pm', 12, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/psle-powerup-camp.jpg'),
('PSLE Power Up Camp', 'PSLE Chinese Oral Booster', 180.00, 220.00, '50', '3 days', 1, 1, 1, '2024-11-05,2024-11-08', '10am-6pm', 27, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/psle-powerup-camp.jpg'),

-- Professionals Workshops (Spread from Aug to Oct)
('Professionals', 'Train-The-Trainer Programme', 700.00, 350.00, '40', '2 days', 1, 1, 1, '2024-08-10,2024-08-12', '9am-5pm', 43, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Mastering the Art of Negotiation', 550.00, 400.00, '35', '1 day', 1, 1, 1, '2024-09-05', '9am-5pm', 25, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Time Mastery: Unlock Your Productive Potential', 600.00, 450.00, '40', '1 day', 1, 1, 1, '2024-09-15', '9am-5pm', 45, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'LinkedIn Makeover: Boost Your Personal Brand', 450.00, 300.00, '30', '1 day', 1, 1, 1, '2024-10-10', '9am-5pm', 72, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Client Relationships and Communication', 275.00, 325.00, '30', '1 day', 1, 1, 1, '2024-10-20', '9am-5pm', 35, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg'),
('Professionals', 'Leadership Development Workshop', 120.00, 370.00, '40', '2 days', 1, 1, 1, '2024-10-25,2024-10-27', '9am-5pm', 48, '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409501', './img/workshop/professionals.jpg');

-- Insert updated dummy memberEvents
INSERT INTO memberEvent (memberID, eventID, fullName, age, schoolName, interests, medicalConditions, lunchOption, specifyOther, experience, pace, liked, disliked, additionalComments)
VALUES
(1, 1, 'John Doe', '12', 'NUS', 'Public Speaking', 'None', 'No Dietary Restrictions', '', 2, 3, 'EVERYTHING', 'NIL', 'Great workshop with excellent materials.'),
(1, 2, 'John Doe', '12', 'NUS', 'Leadership', 'None', 'No Mango', '', 3, 2, 'Engaging sessions', 'NIL', 'Thoroughly enjoyed the discussions.'),
(1, 4, 'John Doe', '12', 'NUS', 'Education', 'None', 'Vegan', 'Soy Milk Only', NULL, NULL, NULL, NULL, NULL),
(2, 1, 'Alice Tan', '10', 'NTU', 'Travel', 'None', 'Vegetarian', 'Gluten-Free Bread', 2, 2, 'Interactive activities', 'None', 'The sessions were very engaging.'),
(2, 2, 'Bob Lee', '11', 'SMU', 'Technology', 'Asthma', 'No Seafood', '', 3, 1, 'Technical expertise shared', 'Too short', 'Would have loved more time.'),
(2, 3, 'Charlie Ng', '13', 'SUTD', 'Art', 'None', 'No Dairy', '', 2, 2, 'Creative environment', 'Lack of supplies', 'The sessions were good overall.'),
(2, 1, 'Diana Wong', '13', 'NUS', 'Cooking', 'Lactose Intolerant', 'Vegan', '', 3, 2, 'Hands-on experience', 'None', 'The best workshop I attended.'),
(2, 2, 'Ethan Lim', '11', 'SIM', 'Sports', 'Peanut Allergy', 'No Nuts', 'Soy Milk Only', 2, 2, 'Well-organised sessions', 'NIL', 'Good pace and structure.'),
(3, 2, 'Fiona Chua', '9', 'NUS', 'Nature', 'None', 'No Dietary Restrictions', '', 1, 2, 'Interactive environment', 'Too advanced for my age', 'Needed more beginner-friendly content.'),
(3, 1, 'George Ong', '10', 'NTU', 'Travel', 'Asthma', 'Vegan', '', 2, 3, 'Clear presentations', 'NIL', 'Good for beginners.'),
(3, 2, 'Hannah Teo', '13', 'SMU', 'Technology', 'None', 'No Mango', '', 3, 2, 'Practical examples', 'Limited materials', 'Would recommend.'),
(4, 3, 'Ian Tan', '12', 'SUTD', 'Art', 'None', 'Vegetarian', 'Gluten-Free Bread', 2, 1, 'Inspiring speakers', 'Time management issues', 'Sessions were enlightening.'),
(4, 1, 'Jasmine Low', '13', 'NUS', 'Cooking', 'Lactose Intolerant', 'Vegan', '', 3, 2, 'Hands-on learning', 'None', 'Very useful workshop.'),
(4, 2, 'Kevin Foo', '11', 'SIM', 'Sports', 'Peanut Allergy', 'No Nuts', 'Soy Milk Only', 2, 2, 'Engaging facilitators', 'None', 'Good effort by the organisers.'),
(4, 3, 'Laura Chan', '10', 'NUS', 'Nature', 'None', 'No Dietary Restrictions', '', 1, 1, 'Relaxed atmosphere', 'Limited time', 'Could use more examples.'),
(2, 1, 'Michael Tan', '12', 'NTU', 'Travel', 'Asthma', 'Vegan', '', 2, 2, 'Great organisation', 'NIL', 'Very professional setup.'),
(5, 2, 'Natalie Goh', '13', 'SMU', 'Technology', 'None', 'No Mango', '', 3, 2, 'Clear content', 'None', 'The sessions were exceptional.'),
(2, 3, 'Oscar Lim', '11', 'SUTD', 'Art', 'None', 'Vegetarian', 'Gluten-Free Bread', 2, 1, 'Great creativity', 'None', 'Well-structured.'),
(3, 1, 'Paula Sim', '9', 'NUS', 'Cooking', 'None', 'Vegan', '', 1, 2, 'Good demonstrations', 'Too fast-paced', 'Needed more time for practice.'),
(5, 2, 'Quincy Ang', '10', 'SIM', 'Sports', 'None', 'No Nuts', '', 2, 2, 'Engaging games', 'NIL', 'Would attend again.'),
(5, 3, 'Rachel Yeo', '13', 'NUS', 'Nature', 'None', 'No Dairy', '', 3, 2, 'Very interactive', 'None', 'Highly recommend.'),
(5, 1, 'Steven Lee', '11', 'NTU', 'Art', 'Asthma', 'Vegetarian', 'Soy Milk Only', 2, 2, 'Knowledgeable instructors', 'None', 'Very satisfied.'),
(5, 2, 'Tina Ho', '12', 'SMU', 'Cooking', 'Lactose Intolerant', 'Vegan', '', 3, 2, 'Excellent materials', 'None', 'The sessions were fantastic.'),
(6, 1, 'Aaron Lim', '12', 'NUS', 'Public Speaking', 'Asthma', 'Vegan', 'Soy Milk Only', 2, 3, 'Amazing speakers', 'None', 'Learned a lot.'),
(6, 2, 'Beatrice Tan', '9', 'NTU', 'Art', 'None', 'No Dairy', '', 1, 2, 'Fun activities', 'NIL', 'Good experience overall.'),
(6, 3, 'Caleb Ng', '11', 'SMU', 'Technology', 'Peanut Allergy', 'No Nuts', '', 2, 2, 'Practical content', 'None', 'Very helpful.'),
(6, 1, 'Denise Chua', '10', 'SIM', 'Cooking', 'Lactose Intolerant', 'Vegetarian', 'Gluten-Free Bread', 3, 2, 'Engaging activities', 'NIL', 'Would join again.'),
(6, 2, 'Elliot Lee', '13', 'SUTD', 'Nature', 'None', 'No Mango', '', 3, 2, 'Interactive lessons', 'None', 'Very enjoyable.'),
(6, 3, 'Faye Wong', '11', 'NUS', 'Leadership', 'Asthma', 'No Seafood', '', 2, 2, 'Great discussions', 'None', 'The sessions were fruitful.'),
(7, 1, 'Grace Tan', '10', 'NTU', 'Travel', 'None', 'No Dietary Restrictions', '', 1, 3, 'Relaxed pace', 'None', 'Learned a lot.'),
(7, 2, 'Hugo Lim', '12', 'SMU', 'Education', 'None', 'Vegan', 'Soy Milk Only', 3, 2, 'Very insightful', 'None', 'Would attend again.'),
(7, 3, 'Iris Chua', '9', 'SIM', 'Sports', 'None', 'No Nuts', '', 1, 2, 'Fun environment', 'None', 'Very positive experience.'),
(7, 1, 'Jason Ong', '13', 'SUTD', 'Art', 'Asthma', 'Vegetarian', '', 3, 2, 'Creative tasks', 'Limited supplies', 'Would have loved more materials.'),
(7, 2, 'Karen Low', '11', 'NUS', 'Cooking', 'None', 'No Dairy', '', 3, 2, 'Hands-on learning', 'None', 'Highly satisfied with the workshop.'),
(8, 3, 'Leo Foo', '12', 'NTU', 'Technology', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread', 3, 2, 'Practical demonstrations', 'Too short', 'Good session but could be longer.'),
(8, 1, 'Mona Tan', '9', 'SMU', 'Travel', 'None', 'No Mango', '', 1, 2, 'Clear instructions', 'Limited interaction', 'The sessions were informative.'),
(8, 2, 'Nathan Lee', '10', 'SIM', 'Nature', 'None', 'Vegan', '', 1, 2, 'Great environment', 'None', 'The pace was perfect for me.'),
(8, 3, 'Olivia Lim', '13', 'SUTD', 'Public Speaking', 'Asthma', 'No Seafood', '', 1, 2, 'Excellent instructors', 'None', 'One of the best workshops I’ve attended.'),
(9, 1, 'Paul Sim', '11', 'NUS', 'Education', 'None', 'No Dietary Restrictions', '', 1, 2, 'Helpful tips', 'Limited follow-up', 'Learned a lot, but more support would help.'),
(9, 2, 'Queenie Foo', '10', 'NTU', 'Art', 'None', 'No Mango', '', 1, 2, 'Interactive sessions', 'None', 'Overall, a good experience.'),
(9, 3, 'Ryan Ng', '12', 'SMU', 'Sports', 'Lactose Intolerant', 'Vegetarian', 'Soy Milk Only', 3, 2, 'Great energy from facilitators', 'None', 'Would attend again.'),
(10, 1, 'Samantha Lee', '9', 'SIM', 'Leadership', 'None', 'No Dairy', '', 3, 2, 'Inspirational speakers', 'None', 'Very motivating.'),
(10, 2, 'Timothy Tan', '13', 'SUTD', 'Cooking', 'None', 'Vegan', '', 3, 2, 'Very hands-on', 'None', 'Best workshop so far.'),
(6, 4, 'Aaron Lim', '12', 'NUS', 'Public Speaking', 'Asthma', 'Vegan', 'Soy Milk Only', 3, 2, 'Engaging speakers', 'None', 'Great insights shared.'),
(6, 5, 'Beatrice Tan', '9', 'NTU', 'Art', 'None', 'No Dairy', '', 3, 2, 'Fun creative tasks', 'Limited time', 'Would recommend to beginners.'),
(6, 6, 'Caleb Ng', '11', 'SMU', 'Technology', 'Peanut Allergy', 'No Nuts', '', 3, 2, 'Interactive activities', 'None', 'The sessions were engaging.'),
(6, 7, 'Denise Chua', '10', 'SIM', 'Cooking', 'Lactose Intolerant', 'Vegetarian', 'Gluten-Free Bread', 3, 2, 'Hands-on training', 'None', 'Loved the cooking exercises.'),
(6, 8, 'Elliot Lee', '13', 'SUTD', 'Nature', 'None', 'No Mango', '', 2, 1, 'Relaxing environment', 'None', 'Very enjoyable sessions.'),
(6, 9, 'Faye Wong', '11', 'NUS', 'Leadership', 'Asthma', 'No Seafood', '', 2, 1, 'Inspiring discussions', 'None', 'Well-organised.'),
(6, 10, 'Grace Tan', '12', 'NTU', 'Travel', 'None', 'No Dietary Restrictions', '', 2, 1, 'Explored new concepts', 'None', 'Great workshop for travelers.'),
(6, 11, 'Hugo Lim', '9', 'SMU', 'Education', 'None', 'Vegan', 'Soy Milk Only', 2, 1, 'Thorough content', 'None', 'Good for educators.'),
(7, 4, 'Iris Chua', '10', 'SIM', 'Sports', 'None', 'No Nuts', '', 2, 1, 'Interactive lessons', 'None', 'Enjoyed the group activities.'),
(7, 5, 'Jason Ong', '13', 'SUTD', 'Art', 'Asthma', 'Vegetarian', '', 2, 1, 'Creative tasks', 'Limited supplies', 'Would have loved more materials.'),
(7, 6, 'Karen Low', '11', 'NUS', 'Cooking', 'None', 'No Dairy', '', 2, 1, 'Hands-on learning', 'None', 'Highly satisfied with the workshop.'),
(7, 7, 'Leo Foo', '12', 'NTU', 'Technology', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread', 2, 1, 'Practical demonstrations', 'Too short', 'Good session but could be longer.'),
(7, 8, 'Mona Tan', '9', 'SMU', 'Travel', 'None', 'No Mango', '', 2, 1, 'Clear instructions', 'Limited interaction', 'The sessions were informative.'),
(7, 9, 'Nathan Lee', '10', 'SIM', 'Nature', 'None', 'Vegan', '', 2, 1, 'Great environment', 'None', 'The pace was perfect for me.'),
(7, 10, 'Olivia Lim', '13', 'SUTD', 'Public Speaking', 'Asthma', 'No Seafood', '', 3, 2, 'Excellent instructors', 'None', 'One of the best workshops I’ve attended.'),
(7, 11, 'Paul Sim', '11', 'NUS', 'Education', 'None', 'No Dietary Restrictions', '', 3, 2, 'Helpful tips', 'Limited follow-up', 'Learned a lot, but more support would help.'),
(8, 4, 'Queenie Foo', '10', 'NTU', 'Art', 'None', 'No Mango', '', 3, 2, 'Interactive sessions', 'None', 'Overall, a good experience.'),
(8, 5, 'Ryan Ng', '12', 'SMU', 'Sports', 'Lactose Intolerant', 'Vegetarian', 'Soy Milk Only', 3, 2, 'Great energy from facilitators', 'None', 'Would attend again.'),
(8, 6, 'Samantha Lee', '9', 'SIM', 'Leadership', 'None', 'No Dairy', '', 3, 2, 'Inspirational speakers', 'None', 'Very motivating.'),
(8, 7, 'Timothy Tan', '13', 'SUTD', 'Cooking', 'None', 'Vegan', '', 3, 2, 'Very hands-on', 'None', 'Best workshop so far.'),
(8, 8, 'Uma Chua', '11', 'NUS', 'Travel', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread', 3, 2, 'Engaging activities', 'None', 'Learned a lot and enjoyed the session.'),
(8, 9, 'Vera Lim', '12', 'NTU', 'Technology', 'None', 'No Dietary Restrictions', '', 3, 2, 'Practical knowledge shared', 'None', 'Very informative and well-structured.'),
(8, 10, 'Wendy Ong', '9', 'SMU', 'Nature', 'Asthma', 'Vegan', '', 3, 2, 'Relaxed and engaging', 'None', 'Perfect for nature enthusiasts.'),
(8, 11, 'Xander Low', '13', 'SIM', 'Art', 'None', 'Vegetarian', '', 3, 2, 'Great creative exercises', 'None', 'Loved the collaborative environment.'),
(9, 4, 'Yvonne Tan', '10', 'SUTD', 'Public Speaking', 'None', 'No Mango', '', 3, 2, 'Excellent presentations', 'None', 'Improved my speaking skills.'),
(9, 5, 'Zachary Lee', '11', 'NUS', 'Cooking', 'Lactose Intolerant', 'Vegetarian', 'Soy Milk Only', 3, 2, 'Hands-on learning', 'None', 'Thoroughly enjoyed cooking techniques.'),
(9, 6, 'Abigail Wong', '12', 'NTU', 'Education', 'None', 'No Dairy', '', 3, 2, 'Very educational', 'None', 'Learned a lot about new teaching strategies.'),
(9, 7, 'Brandon Ng', '13', 'SMU', 'Travel', 'Asthma', 'No Seafood', '', 3, 2, 'Well-organized sessions', 'None', 'Perfect for frequent travelers.'),
(9, 8, 'Cassandra Sim', '9', 'SIM', 'Sports', 'Peanut Allergy', 'No Nuts', 'Gluten-Free Bread', 3, 2, 'Great energy', 'None', 'Would love more sports-related tips.'),
(9, 9, 'Daniel Foo', '10', 'SUTD', 'Technology', 'None', 'Vegan', '', 3, 2, 'Innovative ideas shared', 'None', 'The sessions were eye-opening.'),
(9, 10, 'Elaine Ong', '12', 'NUS', 'Leadership', 'None', 'No Dietary Restrictions', '', 3, 2, 'Inspiring speakers', 'None', 'Great leadership insights.'),
(9, 11, 'Frank Low', '13', 'NTU', 'Art', 'None', 'Vegetarian', 'Soy Milk Only', 3, 2, 'Creative and fun', 'None', 'Highly recommend for art lovers.'),
(10, 4, 'Gina Tan', '9', 'SMU', 'Nature', 'Asthma', 'Vegan', '', 3, 2, 'Relaxing atmosphere', 'None', 'Perfect for outdoor enthusiasts.'),
(10, 5, 'Henry Ng', '10', 'SIM', 'Public Speaking', 'None', 'No Mango', '', 3, 2, 'Engaging presentations', 'None', 'Helped build my confidence.'),
(10, 6, 'Isabelle Foo', '12', 'SUTD', 'Cooking', 'None', 'Vegetarian', 'Gluten-Free Bread', 3, 2, 'Practical cooking tips', 'None', 'Thoroughly enjoyed the hands-on approach.'),
(10, 7, 'Jack Ong', '13', 'NUS', 'Education', 'None', 'No Dairy', '', 3, 2, 'Very insightful', 'None', 'Loved the focus on teaching techniques.'),
(10, 8, 'Kim Lee', '11', 'NTU', 'Travel', 'None', 'No Nuts', '', 3, 2, 'Well-prepared sessions', 'None', 'Perfect for planning trips.'),
(10, 9, 'Liam Tan', '10', 'SMU', 'Sports', 'None', 'No Mango', '', 3, 2, 'Energetic and fun', 'None', 'The activities were very engaging.'),
(10, 10, 'Megan Low', '12', 'SIM', 'Technology', 'Lactose Intolerant', 'Vegetarian', '', 3, 2, 'Innovative concepts shared', 'None', 'Very engaging and forward-thinking.'),
(10, 11, 'Noah Sim', '13', 'SUTD', 'Leadership', 'Peanut Allergy', 'Vegan', '', 3, 2, 'Inspiring stories', 'None', 'Helped develop my leadership skills.'),
(10, 4, 'Olive Ng', '9', 'NUS', 'Nature', 'None', 'No Dietary Restrictions', '', 3, 2, 'Calm and engaging', 'None', 'Loved the connection to nature.'),
(10, 5, 'Peter Tan', '10', 'NTU', 'Art', 'Asthma', 'No Mango', '', 3, 2, 'Creative ideas shared', 'None', 'Enjoyed learning new techniques.'),
(10, 6, 'Quinn Lim', '11', 'SMU', 'Travel', 'None', 'Vegetarian', 'Soy Milk Only', 3, 2, 'Interactive sessions', 'None', 'Great for travel enthusiasts.'),
(10, 7, 'Riley Foo', '12', 'SIM', 'Cooking', 'None', 'No Dairy', '', 3, 2, 'Excellent guidance', 'None', 'Loved the focus on practical cooking.'),
(10, 8, 'Seth Lee', '13', 'SUTD', 'Technology', 'None', 'No Nuts', '', 3, 2, 'Innovative content', 'None', 'Helped me think outside the box.'),
(10, 9, 'Tina Ong', '9', 'NUS', 'Sports', 'Asthma', 'Vegan', '', 3, 2, 'Energetic and well-organized', 'None', 'Perfect for young athletes.'),
(10, 10, 'Uma Tan', '10', 'NTU', 'Public Speaking', 'None', 'No Mango', '', 3, 2, 'Inspirational sessions', 'None', 'Boosted my confidence significantly.');


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

INSERT INTO child (firstName, lastName, age, schoolName, medicalConditions, dietaryPreferences, interests)
VALUES
('Alex', 'Lee', 10, 'NUS Primary School', 'None', 'Vegetarian', 'Art'),
('Bella', 'Tan', 8, 'River Valley Primary', 'Asthma', 'No Nuts', 'Nature'),
('Charlie', 'Ng', 9, 'Bukit Timah Primary', 'Lactose Intolerant', 'No Dairy', 'Technology');

INSERT INTO memberChild (memberID, childID, relationship)
VALUES
(1, 1, 'Parent'),
(1, 2, 'Guardian'),
(1, 3, 'Parent');

-- Example insert statement for the updated referral table
INSERT INTO referral (referrerID, refereeID)
VALUES 
(1, 2), 
(3, 4);

-- Insert dummy data into the voucher table
INSERT INTO voucher (memberID, value, minimumSpend, expiryDate, redeemed)
VALUES
(1, 10.00, 50.00, '2024-12-31', 0), -- Voucher for memberID 1
(2, 20.00, 100.00, '2024-11-30', 1), -- Voucher for memberID 2 (already redeemed)
(3, 15.00, 75.00, '2025-01-15', 0); -- Voucher for memberID 3

-- Insert additional dummy data into the businessCollaboration table
INSERT INTO businessCollaboration (
    businessName, contactNumber, businessEmail, requestedDate, requestedTime, venue, description, participants, lunchNeeded
) 
VALUES 
('Tech Innovators', '91230001', 'info@techinnovators.com', '2024-11-22', '11:00 AM', '100 Orchard Road, #05-10 Plaza Building, S238800', 'Joint seminar on technological advancements.', 15, 1),
('Green Earth Co', '93214567', 'contact@greenearthco.com', '2024-12-01', '09:30 AM', '50 Beach Road, #03-01 Eco Centre, S189700', 'Collaboration to promote sustainability initiatives.', 25, 0),
('FinElite Partners', '92345678', 'partners@finelite.com', '2024-12-05', '03:00 PM', '20 Collyer Quay, #10-10 Marina House, S049319', 'Financial literacy workshop for SMEs.', 30, 1);

-- Insert dummy categories
INSERT INTO blogCategory (name, description)
VALUES 
('Primary School', 'Posts for primary school students and parents'),
('Secondary School', 'Posts for secondary school students and parents'),
('Parents', 'Guides and tips for parents'),
('Public Speaking', 'Resources for improving public speaking skills');

-- Insert dummy posts with full content
INSERT INTO blogPost (memberID, categoryID, title, content, posterType)
VALUES 
-- Primary School
(1, 1, 'How to Prepare for PSLE', 
'Preparing for the PSLE can be a stressful time for both students and parents. Here are some tips to make the process more manageable:<br><br>1. Create a study timetable: Plan your study sessions to ensure all subjects are covered.<br>2. Practice past year papers: Familiarise yourself with the question formats.<br>3. Focus on weak areas: Allocate more time to subjects or topics where you need improvement.<br>4. Take breaks: Avoid burnout by incorporating short breaks in your study routine.<br>5. Stay healthy: Ensure you get enough sleep, eat balanced meals, and stay hydrated.<br><br>With proper preparation and a positive mindset, you can excel in the PSLE. Good luck!', 'Parent'),
(2, 1, 'Fun Ways to Learn Math', 
'Math doesn’t have to be boring! Here are some fun and engaging ways to help primary school students learn math:<br><br>1. Play board games: Games like Monopoly and Snakes & Ladders teach counting and basic math.<br>2. Use apps: Educational apps like Prodigy Math make learning interactive.<br>3. Create puzzles: Use everyday items like coins to make math puzzles.<br>4. Make it hands-on: Let kids measure ingredients for cooking to learn fractions.<br><br>These activities make math enjoyable and help children build confidence in their abilities.', 'Child'),
(3, 1, 'How to Build Good Study Habits', 
'Building good study habits from a young age is crucial for academic success. Here are some tips:<br><br>1. Set a routine: Allocate specific times for studying and stick to it.<br>2. Create a distraction-free space: Ensure the study area is quiet and organised.<br>3. Break it down: Divide large topics into smaller, manageable sections.<br>4. Review regularly: Revise previous lessons to reinforce learning.<br><br>By developing these habits early, students can build a strong foundation for lifelong learning.', 'Parent'),

-- Secondary School
(4, 2, 'Balancing Studies and CCA', 
'Balancing studies and co-curricular activities (CCA) can be challenging but rewarding. Here are some strategies:<br><br>1. Prioritise tasks: Identify urgent and important tasks.<br>2. Use a planner: Schedule study time and CCA commitments.<br>3. Communicate: Let teachers know if you’re struggling with time.<br><br>With these tips, students can succeed in both academics and CCAs.', 'Child'),
(5, 2, 'Choosing Your Electives Wisely', 
'Choosing the right electives in secondary school can shape your future. Consider the following:<br><br>1. Interests: Choose subjects you enjoy.<br>2. Strengths: Opt for areas where you excel.<br>3. Career goals: Align electives with potential career paths.<br><br>Making informed decisions ensures a fulfilling academic experience.', 'Child'),
(6, 2, 'Managing Peer Pressure', 
'Peer pressure is a common challenge for secondary school students. Here are some tips:<br><br>1. Know your values: Stay true to yourself.<br>2. Choose friends wisely: Surround yourself with supportive peers.<br>3. Speak up: Don’t be afraid to say no.<br><br>Building confidence helps in navigating peer pressure effectively.', 'Child'),

-- Parents
(7, 3, 'Parenting Tips for Busy Parents', 
'Managing a busy schedule while parenting can be overwhelming. Here’s how to cope:<br><br>1. Set priorities: Focus on what matters most.<br>2. Establish routines: Create daily schedules for efficiency.<br>3. Involve children: Let them help with age-appropriate tasks.<br>4. Take breaks: Remember to take care of yourself too.<br><br>Effective parenting is about balance and self-care.', 'Parent'),
(8, 3, 'Helping Your Child Cope with Stress', 
'Children face stress too. Here’s how you can help:<br><br>1. Listen: Encourage open communication.<br>2. Teach relaxation: Practice breathing exercises together.<br>3. Be supportive: Validate their feelings without judgement.<br><br>Helping children manage stress builds resilience.', 'Parent'),
(9, 3, 'Building Strong Parent-Child Relationships', 
'Strong parent-child relationships are built on trust and communication. Here’s how to strengthen them:<br><br>1. Spend quality time: Dedicate time to activities your child enjoys.<br>2. Show appreciation: Praise their efforts, not just results.<br>3. Be a good listener: Make them feel heard and valued.<br><br>A strong bond fosters a supportive environment for growth.', 'Child'),

-- Public Speaking
(10, 4, 'Mastering Public Speaking', 
'Public speaking is a valuable skill. Here’s how to master it:<br><br>1. Understand your audience: Tailor your content to their interests.<br>2. Practice: Rehearse regularly to build confidence.<br>3. Focus on delivery: Pay attention to your tone and body language.<br><br>With practice, anyone can excel at public speaking.', 'Child'),
(11, 4, 'Overcoming Stage Fright', 
'Stage fright is common but conquerable. Here are some tips:<br><br>1. Prepare thoroughly: The more prepared you are, the less nervous you’ll feel.<br>2. Breathe deeply: Deep breaths calm your nerves.<br>3. Start small: Practice speaking in front of a mirror or close friends.<br><br>Remember, even the best speakers started as beginners.', 'Parent'),
(12, 4, 'Engaging Your Audience', 
'Engaging your audience is key to effective public speaking. Here’s how:<br><br>1. Use stories: People connect with personal anecdotes.<br>2. Ask questions: Interaction keeps listeners engaged.<br>3. Be dynamic: Use gestures and vary your tone for emphasis.<br><br>Engagement makes your message memorable.', 'Parent');

-- Insert dummy comments
INSERT INTO blogComment (postID, memberID, comment, posterType)
VALUES 
-- Comments for Primary School
(1, 2, 'This is very helpful for PSLE preparation!', 'Child'),
(1, 3, 'Great tips, thank you!', 'Parent'),
(1, 4, 'I will definitely try these tips with my child.', 'Parent'),
(2, 1, 'Math games are a fantastic idea!', 'Parent'),
(2, 5, 'My kids love learning through play.', 'Child'),
(3, 6, 'Building study habits early is so important!', 'Child'),
(3, 7, 'This post is very informative.', 'Parent'),
(3, 8, 'Thanks for sharing these insights!', 'Parent'),

-- Comments for Secondary School
(4, 2, 'Balancing studies and CCA is tough, but this helps.', 'Child'),
(4, 3, 'I needed this advice, thank you!', 'Parent'),
(5, 1, 'Choosing electives wisely can really shape your future.', 'Parent'),
(5, 6, 'This post is very insightful.', 'Child'),
(6, 8, 'Handling peer pressure is a life skill, well-written!', 'Parent'),
(6, 7, 'This article resonates with me.', 'Child'),

-- Comments for Parents
(7, 3, 'Thank you for these parenting tips!', 'Parent'),
(7, 5, 'Very relatable advice.', 'Child'),
(8, 6, 'Helping children cope with stress is crucial.', 'Child'),
(8, 2, 'Practical and easy to apply advice.', 'Parent'),
(9, 1, 'Building strong relationships is so important.', 'Parent'),
(9, 4, 'This article is heartwarming.', 'Parent'),

-- Comments for Public Speaking
(10, 3, 'Mastering public speaking is my goal, great article!', 'Parent'),
(10, 2, 'I appreciate the practical tips here.', 'Child'),
(11, 4, 'Overcoming stage fright is so challenging, thanks for this.', 'Parent'),
(11, 5, 'These tips will definitely help me improve.', 'Child'),
(12, 6, 'Engaging your audience is key, loved this post!', 'Child'),
(12, 7, 'The strategies here are very actionable.', 'Parent');

-- Insert dummy upvotes
INSERT INTO postUpvote (postID, memberID)
VALUES 
-- Upvotes for Primary School
(1, 2), (1, 3), (1, 4),
(2, 1), (2, 5), (2, 6),
(3, 7), (3, 8), (3, 2),

-- Upvotes for Secondary School
(4, 2), (4, 3), (4, 5),
(5, 6), (5, 1), (5, 8),
(6, 7), (6, 8), (6, 2),

-- Upvotes for Parents
(7, 3), (7, 5), (7, 6),
(8, 2), (8, 1), (8, 7),
(9, 4), (9, 6), (9, 8),

-- Upvotes for Public Speaking
(10, 3), (10, 2), (10, 4),
(11, 5), (11, 6), (11, 7),
(12, 7), (12, 6), (12, 8);

INSERT INTO blogMeetUp (categoryID, title, description, isOnline, startDateTime, endDateTime, venue, link)
VALUES 
-- Primary School
(1, 'Primary School In-Person Parenting Meet Up', 
  'Join us to connect with fellow parents, share tips, and explore strategies for raising primary school children.', 
  0, '2025-03-15 09:00:00', '2025-03-15 11:00:00', 
  '60 Paya Lebar Road, #07-54 Paya Lebar Square, S409051', 
  'https://forms.gle/6hUC6G1LKHjQtmbh6'),

-- Secondary School
(2, 'Secondary School Success Strategies', 
  'Learn expert strategies to help your secondary school child succeed academically and socially in this online session.', 
  1, '2025-03-10 19:00:00', '2025-03-10 21:00:00', 
  NULL, 
  'https://zoom.us/j/123456789'),

-- Parents
(3, 'Challenges of Parenting Forum', 
  'Join a virtual forum where parents share solutions and learn from each other to tackle common parenting challenges.', 
  1, '2025-03-15 20:00:00', '2025-03-15 22:00:00', 
  NULL, 
  'https://forms.gle/parenting-forum'),

-- Public Speaking
(4, 'Public Speaking In-Person Meet Up', 
  'Overcome your fear of public speaking through engaging exercises and confidence-building activities in this in-person session.', 
  0, '2025-03-25 14:00:00', '2025-03-25 16:00:00', 
  '100 Orchard Road, #05-10 Plaza Building, S238800', 
  'https://forms.gle/NygnGZCiX6VsZvaV6');


-- 4) Select all tables
SELECT * FROM [member];
SELECT * FROM [event];
SELECT * FROM memberEvent;
SELECT * FROM admin;
SELECT * FROM appointment;
SELECT * FROM child;
SELECT * FROM memberChild;
SELECT * FROM referral;
SELECT * FROM voucher;
SELECT * FROM businessCollaboration;
SELECT * FROM blogCategory;
SELECT * FROM blogPost;
SELECT * FROM blogComment;
SELECT * FROM blogMeetUp;
SELECT * FROM postUpvote;