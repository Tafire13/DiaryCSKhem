const { error } = require('console')
const db = require('../config/database')

const initTable = () => {
    const sql = `
    create table if not exists Users(
        uid         integer primary key autoincrement,
        username    text,
        role        integer default 0
    );
    `
    db.run(sql, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Table 'users' ready.");
        }
    });
}
initTable();

const Users = {
    FindByUsername: (username, callback) =>{
        const sql = "select * from Users where username = ?"
        db.get(sql, [username], (err, row) =>{
            if(err) callback(null);
            else callback(row);
        });
    },

    createUser:(username, role = 0, callback) =>{
        const sql = "insert into Users(username, role) values(?, ?)"
        db.run(sql, [username, role], function (err) {
            if(err) return callback(false);
            else callback(true);
        });
    }

}

module.exports = Users;