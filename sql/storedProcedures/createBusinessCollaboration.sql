CREATE PROCEDURE usp_create_business_collaboration
    @businessName NVARCHAR(200),
    @contactNumber NVARCHAR(20),
    @businessEmail NVARCHAR(100),
    @requestedDate DATE,
    @requestedTime NVARCHAR(50),
    @venue NVARCHAR(500),
    @description NVARCHAR(1000),
    @participants INT,
    @lunchNeeded BIT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO businessCollaboration (
        businessName,
        contactNumber,
        businessEmail,
        requestedDate,
        requestedTime,
        venue,
        description,
        participants,
        lunchNeeded
    )
    VALUES (
        @businessName,
        @contactNumber,
        @businessEmail,
        @requestedDate,
        @requestedTime,
        @venue,
        @description,
        @participants,
        @lunchNeeded
    );

    -- Return the ID of the newly created collaboration
    SELECT SCOPE_IDENTITY() AS collaborationID;
END;
