CREATE PROCEDURE usp_registerChild
    @memberID INT,
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @age INT,
    @schoolName NVARCHAR(100),
    @medicalConditions NVARCHAR(500),
    @dietaryPreferences NVARCHAR(500),
    @interests NVARCHAR(500),
    @relationship NVARCHAR(100),
    @childID INT OUTPUT, -- To return the generated childID
    @memberChildID INT OUTPUT -- To return the generated memberChildID
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insert child details into the 'child' table
        INSERT INTO child (
            firstName,
            lastName,
            age,
            schoolName,
            medicalConditions,
            dietaryPreferences,
            interests
        )
        VALUES (
            @firstName,
            @lastName,
            @age,
            @schoolName,
            @medicalConditions,
            @dietaryPreferences,
            @interests
        );

        -- Retrieve the newly inserted childID
        SET @childID = SCOPE_IDENTITY();

        -- Insert the relationship into 'memberChild' table
        INSERT INTO memberChild (
            memberID,
            childID,
            relationship
        )
        VALUES (
            @memberID,
            @childID,
            @relationship
        );

        -- Retrieve the newly inserted memberChildID
        SET @memberChildID = SCOPE_IDENTITY();

        -- Commit the transaction
        COMMIT TRANSACTION;

        -- Return success
        RETURN 0;
    END TRY
    BEGIN CATCH
        -- Rollback the transaction in case of an error
        ROLLBACK TRANSACTION;

        -- Return error information
        RETURN ERROR_NUMBER();
    END CATCH
END;
