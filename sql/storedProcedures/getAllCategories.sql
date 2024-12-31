CREATE PROCEDURE usp_get_all_categories
AS
BEGIN
    SELECT 
        categoryID,
        name AS categoryName,
        description
    FROM blogCategory
    ORDER BY name;
END;
