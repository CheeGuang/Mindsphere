CREATE PROCEDURE usp_get_all_admins
AS
BEGIN
    SELECT 
        adminID,
        firstName,
        lastName,
        email,
        contactNo,
        profilePicture,
        availability,
        bio,
        calendlyLink,
        calendlyAccessToken
    FROM 
        admin;
END;
