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
    @memberEventID INT OUTPUT,
    @membershipUpdated BIT OUTPUT -- New output parameter to indicate if membershipEndDate was updated
AS
BEGIN
    SET @membershipUpdated = 0; -- Default to no update

    -- Insert into memberEvent table
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

    -- Check if the membershipEndDate in the member table is NULL
    IF EXISTS (
        SELECT 1 
        FROM member 
        WHERE memberID = @memberID AND membershipEndDate IS NULL
    )
    BEGIN
        -- Update membershipEndDate to 1 year from the current date
        UPDATE member
        SET membershipEndDate = DATEADD(YEAR, 1, GETDATE())
        WHERE memberID = @memberID;

        -- Indicate that the membershipEndDate was updated
        SET @membershipUpdated = 1;
    END

    -- Return success
    RETURN 0;
END;
