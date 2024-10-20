CREATE PROCEDURE usp_create_member
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @email NVARCHAR(100),
    @contactNo NVARCHAR(20),
    @password NVARCHAR(100)
AS
BEGIN
    -- Check if a member with the given email already exists
    IF EXISTS (SELECT 1 FROM [member] WHERE email = @email)
    BEGIN
        -- Update the existing member's details
        UPDATE [member]
        SET firstName = @firstName,
            lastName = @lastName,
            contactNo = @contactNo,
            password = @password
        WHERE email = @email;

        -- Return the ID of the updated member
        SELECT memberID AS updatedMemberID
        FROM [member]
        WHERE email = @email;
    END
    ELSE
    BEGIN
        -- Insert a new member if email does not exist
        INSERT INTO [member] (firstName, lastName, email, contactNo, password)
        VALUES (@firstName, @lastName, @email, @contactNo, @password);

        -- Return the ID of the newly created member
        SELECT SCOPE_IDENTITY() AS newMemberID;
    END
END;
