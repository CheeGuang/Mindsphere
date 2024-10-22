CREATE PROCEDURE usp_get_member_id_by_email
    @Email NVARCHAR(100)
AS
BEGIN
    -- Check if the provided email exists in the member table and return the memberID
    SELECT memberID
    FROM [member]
    WHERE email = @Email;
END;