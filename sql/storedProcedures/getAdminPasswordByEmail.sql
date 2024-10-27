CREATE PROCEDURE usp_get_admin_password_by_email
    @Email NVARCHAR(100)
AS
BEGIN
    -- Retrieve the password for the provided email
    SELECT password
    FROM [admin]
    WHERE email = @Email;
END;
