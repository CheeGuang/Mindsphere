-- Example adjustment to usp_enrollMemberToEvent
CREATE PROCEDURE usp_enrollMemberToEvent
    @memberID INT,
    @eventID INT,
    @fullName NVARCHAR(100),
    @age NVARCHAR(10),
    @schoolName NVARCHAR(100),
    @interests NVARCHAR(200),
    @medicalConditions NVARCHAR(500),
    @lunchOption NVARCHAR(100),
    @specifyOther NVARCHAR(200),
    @memberEventID INT OUTPUT -- Add this OUTPUT parameter
AS
BEGIN
    -- Your INSERT logic here
    INSERT INTO memberEvent (
        memberID,
        eventID,
        fullName,
        age,
        schoolName,
        interests,
        medicalConditions,
        lunchOption,
        specifyOther
    )
    VALUES (
        @memberID,
        @eventID,
        @fullName,
        @age,
        @schoolName,
        @interests,
        @medicalConditions,
        @lunchOption,
        @specifyOther
    );

    -- Get the newly inserted memberEventID
    SET @memberEventID = SCOPE_IDENTITY();

    -- Return success with the memberEventID
    RETURN 0;
END;
