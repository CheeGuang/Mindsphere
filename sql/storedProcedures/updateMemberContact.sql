CREATE PROCEDURE usp_update_member_contact
    @memberID INT,
    @contactNo NVARCHAR(20),
    @referralCode NVARCHAR(50) = NULL,
    @referralSuccessful BIT OUTPUT -- Output parameter for referral success
AS
BEGIN
    SET NOCOUNT ON;

    -- Initialise referralSuccessful to 0 by default
    SET @referralSuccessful = 0;

    -- Check if the member exists
    IF NOT EXISTS (SELECT 1 FROM [member] WHERE memberID = @memberID)
    BEGIN
        -- If member doesn't exist, return an error
        RAISERROR('Member not found.', 16, 1);
        RETURN;
    END

    -- Update the contact number for the specified memberID
    UPDATE [member]
    SET contactNo = @contactNo
    WHERE memberID = @memberID;

    -- Perform referral code logic if a referral code is provided
    IF @referralCode IS NOT NULL
    BEGIN
        -- Check if the referral code exists in the system
        IF EXISTS (SELECT 1 FROM [member] WHERE referralCode = @referralCode)
        BEGIN
            DECLARE @referrerID INT;

            -- Retrieve the referrer's memberID
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

                -- Insert vouchers for both the referrer and referee
                DECLARE @voucherValue DECIMAL(10, 2) = 50.00; -- Voucher value
                DECLARE @minimumSpend DECIMAL(10, 2) = 0.00; -- No minimum spend
                DECLARE @expiryDate DATETIME = DATEADD(MONTH, 1, GETDATE()); -- 1-month expiry

                -- Voucher for the referrer
                INSERT INTO voucher (memberID, value, minimumSpend, expiryDate, redeemed)
                VALUES (@referrerID, @voucherValue, @minimumSpend, @expiryDate, 0);

                -- Voucher for the referee
                INSERT INTO voucher (memberID, value, minimumSpend, expiryDate, redeemed)
                VALUES (@memberID, @voucherValue, @minimumSpend, @expiryDate, 0);
            END
        END
        ELSE
        BEGIN
            -- If referral code is invalid, return an error
            RAISERROR('Invalid referral code.', 16, 1);
            RETURN;
        END
    END

    -- Return success message
    SELECT 'Contact number updated successfully' AS Message;
END;
