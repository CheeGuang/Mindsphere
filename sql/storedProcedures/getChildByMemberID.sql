CREATE PROCEDURE usp_get_child_by_memberID
    @memberID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.childID,
        c.firstName,
        c.lastName,
        c.age,
        c.schoolName,
        c.medicalConditions,
        c.dietaryPreferences,
        c.interests,
        mc.relationship
    FROM child c
    INNER JOIN memberChild mc ON c.childID = mc.childID
    WHERE mc.memberID = @memberID;
END;
