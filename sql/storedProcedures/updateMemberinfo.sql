CREATE PROCEDURE usp_update_member
    @memberID INT,
    @firstName NVARCHAR(100) = NULL,
    @lastName NVARCHAR(100) = NULL,
    @email NVARCHAR(100) = NULL,
    @contactNo NVARCHAR(20) = NULL
    
AS
BEGIN
    -- Check if a member with the given memberID exists
    IF EXISTS (SELECT 1 FROM [member] WHERE memberID = @memberID)
    BEGIN
        -- Update the existing member's details
        UPDATE [member]
        SET 
            firstName = COALESCE(@firstName, firstName),
            lastName = COALESCE(@lastName, lastName),
            email = COALESCE(@email, email),
            contactNo = COALESCE(@contactNo, contactNo),
            
        WHERE memberID = @memberID;

        -- Return a success message or the updated member ID
        SELECT @memberID AS updatedMemberID;
    END
    ELSE
    BEGIN
        -- Return an error message if the member does not exist
        SELECT 'Member not found' AS ErrorMessage;
    END
END;
