CREATE PROCEDURE usp_get_member_emailVC_by_ID
    @memberID INT
AS
BEGIN
    -- Select email verification code and timestamp for the given memberID
    SELECT 
        emailVC, 
        emailVCTimestamp
    FROM 
        [member]
    WHERE 
        memberID = @memberID;
END;
