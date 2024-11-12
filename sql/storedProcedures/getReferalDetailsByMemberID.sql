CREATE PROCEDURE usp_getReferralDetailsByMemberID
    @memberID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Get the total number of referrals made by the member
    SELECT 
        referrerID AS MemberID,
        COUNT(refereeID) AS TotalReferrals
    FROM 
        referral
    WHERE 
        referrerID = @memberID
    GROUP BY 
        referrerID;

    -- Check if the member has been referred by someone else
    SELECT 
        refereeID AS MemberID,
        referrerID AS ReferredBy
    FROM 
        referral
    WHERE 
        refereeID = @memberID;

    -- Get the total unredeemed vouchers
    DECLARE @referrerUnredeemed INT, @refereeUnredeemed INT;

    -- Count unredeemed referrals made by the member (excluding referrerID = 1)
    SELECT 
        @referrerUnredeemed = COUNT(*)
    FROM 
        referral
    WHERE 
        referrerID = @memberID AND referrerRedeemed = 0 AND referrerID != 1;

    -- Count unredeemed referrals for the member as a referee
    SELECT 
        @refereeUnredeemed = COUNT(*)
    FROM 
        referral
    WHERE 
        refereeID = @memberID AND referreeRedeemed = 0;

    -- Return the total unredeemed vouchers
    SELECT 
        @referrerUnredeemed + @refereeUnredeemed AS TotalUnredeemedVouchers;
END;
