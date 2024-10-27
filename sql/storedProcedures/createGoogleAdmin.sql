CREATE PROCEDURE usp_create_google_admin
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @Email NVARCHAR(100),
    @profilePicture NVARCHAR(500) = NULL -- Optional parameter
AS
BEGIN
    -- Insert new admin
    INSERT INTO [admin] (firstName, lastName, email, profilePicture)
    VALUES (@firstName, @lastName, @Email, @profilePicture);

    -- Return the newly created adminID
    SELECT SCOPE_IDENTITY() AS adminID;
END;
