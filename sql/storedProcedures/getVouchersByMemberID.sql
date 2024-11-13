-- Create a stored procedure to get vouchers by memberID
CREATE PROCEDURE usp_get_vouchers_by_memberID
    @memberID INT
AS
BEGIN
    -- Select vouchers for the specified memberID
    SELECT 
        voucherID,
        memberID,
        value,
        minimumSpend,
        expiryDate,
        redeemed
    FROM 
        voucher
    WHERE 
        memberID = @memberID;
END;
