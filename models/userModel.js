const { sql, poolPromise } = require('../config/db');


async function createUser({ name, email }) {
    const pool = await poolPromise;
    const result = await pool
    .request()
    .input('name', sql.NVarChar(255), name)
    .input('email', sql.NVarChar(255), email)
    .query('INSERT INTO Users (name, email) OUTPUT INSERTED.* VALUES (@name, @email);');

    return result.recordset[0];
}


async function getAllUsers() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Users;');
    return result.recordset;
}


async function getUserById(id) {
const pool = await poolPromise;
const result = await pool
.request()
.input('id', sql.Int, id)
.query('SELECT * FROM Users WHERE id = @id;');
return result.recordset[0];
}


async function updateUser(id, { name, email }) {
    const pool = await poolPromise;
    const updates = [];
    if (name !== undefined) updates.push('name = @name');
    if (email !== undefined) updates.push('email = @email');
    if (updates.length === 0) return null;


    const setClause = updates.join(', ');


    const req = pool.request().input('id', sql.Int, id);
    if (name !== undefined) req.input('name', sql.NVarChar(255), name);
    if (email !== undefined) req.input('email', sql.NVarChar(255), email);


    const query = `UPDATE Users SET ${setClause} WHERE id = @id;`;
    const result = await req.query(query);
    return result.recordset[0];
}


async function deleteUser(id) {
    const pool = await poolPromise;
    const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Users WHERE id = @id;');


    //number of rows deleted
    return result.rowsAffected[0] > 0;
}


module.exports = {
createUser,
getAllUsers,
getUserById,
updateUser,
deleteUser
};