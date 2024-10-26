CREATE PROCEDURE usp_delete_event_by_id
    @eventID INT
AS
BEGIN
    -- Begin a transaction for safe deletion
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Delete the event by eventID
        DELETE FROM Event
        WHERE eventID = @eventID;

        -- Check if the event was deleted
        IF @@ROWCOUNT = 0
        BEGIN
            -- Rollback transaction if no rows were deleted (eventID not found)
            ROLLBACK TRANSACTION;
            THROW 50000, 'Event not found.', 1;
        END

        -- Commit transaction if successful
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback transaction if an error occurs
        ROLLBACK TRANSACTION;
        -- Rethrow the error
        THROW;
    END CATCH
END;
