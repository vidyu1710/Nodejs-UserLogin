module.exports = {
    addUser: `
    BEGIN TRANSACTION [Tran1]
    BEGIN TRY
        DECLARE @temp TABLE(id INT);
        INSERT INTO Employee(first_name, last_name, organization_name)
        OUTPUT INSERTED.id INTO @temp(id) VALUES(@firstName, @lastName, @companyName);

        INSERT INTO [User] (employee_id, email, password_hash)
        VALUES((SELECT id FROM @temp), @email, @passwordHash);
        
        COMMIT TRANSACTION [Tran1]
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION [Tran1]
    END CATCH  `,
    getUserInformation: `
    SELECT u.email, u.password_hash as passwordHash, u.employee_id as employeeId
    FROM [User] u WHERE u.email = @email`,
    getUserList: `
    SELECT (SELECT COUNT(u.id) as totalRecords FROM [User] u, Employee e 
    WHERE u.employee_id = e.id searchSubQuery) as totalRecords,
    (SELECT u.email, u.employee_id as employeeId, e.first_name, e.last_name, e.organization_name
    FROM [User] u, Employee e WHERE u.employee_id = e.id searchSubQuery 
    OFFSET @totalLastRecords ROWS FETCH NEXT @requiredRecords ROWS ONLY FOR JSON PATH) as users
    `
}