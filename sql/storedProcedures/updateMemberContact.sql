CREATE PROCEDURE usp_update_member_contact
    @memberID INT,
    @contactNo NVARCHAR(20)
AS
BEGIN
    -- Check if the member exists
    IF NOT EXISTS (SELECT 1 FROM [member] WHERE memberID = @memberID)
    BEGIN
        -- If member doesn't exist, return an error
        RAISERROR('Member not found.', 16, 1);
        RETURN;
    END

    -- Update the contact number for the specified memberID
    UPDATE [member]
    SET contactNo = @contactNo
    WHERE memberID = @memberID;

    -- Return success message
    SELECT 'Contact number updated successfully' AS Message;
END;
