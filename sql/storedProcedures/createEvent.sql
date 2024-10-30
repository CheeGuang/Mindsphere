CREATE PROCEDURE usp_create_event
    @type NVARCHAR(100), 
    @title NVARCHAR(200),
    @price DECIMAL(10, 2),
    @oldPrice DECIMAL(10, 2) = NULL,
    @classSize NVARCHAR(50), 
    @duration NVARCHAR(50), 
    @lunchProvided BIT = 1,
    @lessonMaterialsProvided BIT = 1,
    @accessToMembership BIT = 1,
    @availableDates NVARCHAR(MAX), 
    @time NVARCHAR(50),
    @totalParticipants INT = 0,
    @venue NVARCHAR(500),
    @picture NVARCHAR(500)
AS
BEGIN

    INSERT INTO [event] (type, title, price, oldPrice, classSize, duration, lunchProvided, lessonMaterialsProvided, accessToMembership, availableDates, time, totalParticipants, venue, picture)
    VALUES (@type, @title, @price, @oldPrice, @classSize, @duration, @lunchProvided, @lessonMaterialsProvided, @accessToMembership, @availableDates, @time, @totalParticipants, @venue, @picture);

    SELECT SCOPE_IDENTITY() AS newEventID;

END
