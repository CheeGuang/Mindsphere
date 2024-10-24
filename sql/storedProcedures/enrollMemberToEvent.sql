-- 1) Create stored procedure to enroll a member to an event
CREATE PROCEDURE usp_enrollMemberToEvent
    @memberID INT,
    @eventID INT,
    @fullName NVARCHAR(100),
    @age NVARCHAR(10),
    @schoolName NVARCHAR(100),
    @interests NVARCHAR(200),
    @medicalConditions NVARCHAR(500),
    @lunchOption NVARCHAR(100),
    @specifyOther NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Insert the data into memberEvent table
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

        PRINT 'Enrollment successful.';
    END TRY
    BEGIN CATCH
        -- Catch any error and display the error message
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
GO
