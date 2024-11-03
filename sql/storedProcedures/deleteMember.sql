CREATE PROCEDURE usp_delete_member
    @memberID INT
AS
BEGIN
    -- Check if a member with the given memberID exists
    IF EXISTS (SELECT 1 FROM [member] WHERE memberID = @memberID)
    BEGIN
        -- Delete the member
        DELETE FROM [member]
        WHERE memberID = @memberID;

        -- Return a success message
        SELECT 'Member deleted successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Return an error message if the member does not exist
        SELECT 'Member not found' AS ErrorMessage;
    END
END;
