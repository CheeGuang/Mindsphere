CREATE PROCEDURE usp_update_event
    @eventID INT,
    @title NVARCHAR(255),
    @price FLOAT,
    @availableDates NVARCHAR(255),
    @venue NVARCHAR(255),
    @duration NVARCHAR(255),
    @picture NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Event
    SET 
        title = @title,
        price = @price,
        availableDates = @availableDates,
        venue = @venue,
        duration = @duration,
        picture = @picture
    WHERE 
        eventID = @eventID;

END
