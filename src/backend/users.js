const users = [];

const addUser = ({ id, name, table }) => {
    const numberOfUsersAtTable = users.length;

    if (numberOfUsersAtTable > 3) {
        return { error: 'Table is Full. Please join another table or create a new one!' }
    }
    const newUser = {
        id, name, table
    };

    users.push(newUser);
    return newUser;
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

const getUsersAtTable = (table) => {
    users.filter(user => user.table === table);
    return users.length || 0;
}

module.exports = { addUser, getUser, getUsersAtTable }