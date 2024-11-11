CREATE PROCEDURE usp_AddMemberEventFeedback
    @MemberEventID INT,
    @Experience TINYINT,
    @Pace TINYINT,
    @Liked NVARCHAR(500),
    @Disliked NVARCHAR(500),
    @AdditionalComments NVARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validate the input values
        IF (@Experience < 1 OR @Experience > 3)
        BEGIN
            THROW 50000, 'Experience value must be between 1 and 3.', 1;
        END

        IF (@Pace < 1 OR @Pace > 3)
        BEGIN
            THROW 50000, 'Pace value must be between 1 and 3.', 1;
        END

        -- Update the memberEvent table with the provided data
        UPDATE memberEvent
        SET 
            experience = @Experience,
            pace = @Pace,
            liked = @Liked,
            disliked = @Disliked,
            additionalComments = @AdditionalComments
        WHERE memberEventID = @MemberEventID;

        -- Return success message
        SELECT 'Feedback added successfully.' AS Message;

    END TRY
    BEGIN CATCH
        -- Handle errors
        SELECT 
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_SEVERITY() AS ErrorSeverity,
            ERROR_STATE() AS ErrorState,
            ERROR_LINE() AS ErrorLine,
            ERROR_PROCEDURE() AS ErrorProcedure;
    END CATCH
END;
