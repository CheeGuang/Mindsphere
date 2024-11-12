CREATE PROCEDURE usp_create_member
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @email NVARCHAR(100),
    @contactNo NVARCHAR(20),
    @password NVARCHAR(100),
    @referralCode NVARCHAR(50) NULL,
    @referralSuccessful BIT OUTPUT,
    @newMemberID INT OUTPUT -- Output parameter for newly created or updated member ID
AS
BEGIN
    SET NOCOUNT ON;

    -- Initialise referralSuccessful to 0 by default
    SET @referralSuccessful = 0;
    SET @newMemberID = NULL; -- Initialise to NULL by default

    DECLARE @referrerID INT;
    DECLARE @memberID INT;

    -- Check if a member with the given email already exists
    IF EXISTS (SELECT 1 FROM [member] WHERE email = @email)
    BEGIN
        -- Update the existing member's details
        UPDATE [member]
        SET firstName = @firstName,
            lastName = @lastName,
            contactNo = @contactNo,
            password = @password
        WHERE email = @email;

        -- Retrieve the ID of the updated member
        SELECT @memberID = memberID
        FROM [member]
        WHERE email = @email;

        -- Set newMemberID output to the updated member ID
        SET @newMemberID = @memberID;
    END
    ELSE
    BEGIN
        -- Insert a new member
        INSERT INTO [member] (firstName, lastName, email, contactNo, password)
        VALUES (@firstName, @lastName, @email, @contactNo, @password);

        -- Retrieve the ID of the newly created member
        SET @memberID = SCOPE_IDENTITY();

        -- Set newMemberID output to the newly created member ID
        SET @newMemberID = @memberID;
    END

    -- Perform referral logic after inserting or updating the member
    IF @referralCode IS NOT NULL AND EXISTS (SELECT 1 FROM [member] WHERE referralCode = @referralCode)
    BEGIN
        -- Valid referral code found, retrieve referrer's memberID
        SELECT @referrerID = memberID
        FROM [member]
        WHERE referralCode = @referralCode;

        -- Check if a referral already exists to avoid duplicates
        IF NOT EXISTS (
            SELECT 1 FROM referral
            WHERE referrerID = @referrerID AND refereeID = @memberID
        )
        BEGIN
            -- Insert the referral record
            INSERT INTO referral (referrerID, refereeID)
            VALUES (@referrerID, @memberID);

            -- Set referralSuccessful to 1
            SET @referralSuccessful = 1;
        END
    END
END;
