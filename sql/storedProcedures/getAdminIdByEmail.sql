CREATE PROCEDURE usp_get_admin_id_by_email
    @Email NVARCHAR(100)
AS
BEGIN
    -- Check if the provided email exists in the admin table and return the adminID
    SELECT adminID
    FROM [admin]
    WHERE email = @Email;
END;
