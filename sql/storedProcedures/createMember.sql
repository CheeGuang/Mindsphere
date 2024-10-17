CREATE PROCEDURE usp_create_member
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @email NVARCHAR(100),
    @contactNo NVARCHAR(20),
    @password NVARCHAR(100)
AS
BEGIN
    -- Insert the new member into the member table
    INSERT INTO [member] (firstName, lastName, email, contactNo, password)
    VALUES (@firstName, @lastName, @email, @contactNo, @password);
    
    -- Return the ID of the newly created member
    SELECT SCOPE_IDENTITY() AS newMemberID;
END;
