CREATE PROCEDURE usp_create_google_member
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @Email NVARCHAR(100),
    @profilePicture NVARCHAR(500) = NULL -- Optional parameter
AS
BEGIN
    -- Insert new member
    INSERT INTO [member] (firstName, lastName, email, profilePicture)
    VALUES (@firstName, @lastName, @Email, @profilePicture);

    -- Return the newly created memberID
    SELECT SCOPE_IDENTITY() AS memberID;
END;