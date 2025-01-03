CREATE PROCEDURE usp_get_admin_details_by_id
    @adminID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        adminID,
        firstName,
        lastName,
        email,
        emailVC,
        emailVCTimestamp,
        contactNo,
        contactNoVC,
        contactNoVCTimestamp,
        profilePicture,
        bio,
        availability,
        calendlyLink,
        calendlyAccessToken
    FROM 
        [admin]
    WHERE 
        adminID = @adminID;
END;
