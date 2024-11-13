CREATE PROCEDURE usp_redeem_voucher
    @voucherID INT,
    @successMessage NVARCHAR(255) OUTPUT,
    @errorMessage NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Check if the voucher exists and is not already redeemed or expired
        IF EXISTS (
            SELECT 1 
            FROM voucher
            WHERE voucherID = @voucherID
              AND redeemed = 0
              AND expiryDate >= GETDATE()
        )
        BEGIN
            -- Mark the voucher as redeemed
            UPDATE voucher
            SET redeemed = 1
            WHERE voucherID = @voucherID;

            -- Set the success message
            SET @successMessage = 'Voucher has been successfully redeemed.';
            SET @errorMessage = NULL;
        END
        ELSE
        BEGIN
            -- Check why the voucher cannot be redeemed
            IF NOT EXISTS (SELECT 1 FROM voucher WHERE voucherID = @voucherID)
            BEGIN
                SET @errorMessage = 'Voucher does not exist.';
            END
            ELSE IF EXISTS (SELECT 1 FROM voucher WHERE voucherID = @voucherID AND redeemed = 1)
            BEGIN
                SET @errorMessage = 'Voucher has already been redeemed.';
            END
            ELSE IF EXISTS (SELECT 1 FROM voucher WHERE voucherID = @voucherID AND expiryDate < GETDATE())
            BEGIN
                SET @errorMessage = 'Voucher has expired.';
            END

            SET @successMessage = NULL;
        END
    END TRY
    BEGIN CATCH
        -- Handle any unexpected errors
        SET @errorMessage = ERROR_MESSAGE();
        SET @successMessage = NULL;
    END CATCH
END;
GO
