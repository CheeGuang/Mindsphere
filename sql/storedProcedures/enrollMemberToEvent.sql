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
    @newMembership BIT OUTPUT -- Updated parameter to indicate if membershipEndDate was previously NULL
AS
BEGIN
    SET @newMembership = 0; -- Default to no new membership

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
        -- Set newMembership to TRUE because the current membershipEndDate is NULL
        SET @newMembership = 1;
    END

    -- Update membershipEndDate to 1 year from the current date
    UPDATE member
    SET membershipEndDate = DATEADD(YEAR, 1, GETDATE())
    WHERE memberID = @memberID;

    -- Return success
    RETURN 0;
END;
