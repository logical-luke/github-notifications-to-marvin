const axios = require('axios');

const marvinApiBaseUrl = 'https://serv.amazingmarvin.com/api/';

let todayTasks = [];

axios.defaults.headers.common['X-API-Token'] = process.env.MARVIN_TOKEN;

const createMarvinTask = async (task) => {
    try {
        return await axios.post(marvinApiBaseUrl + 'addTask', {
            'title': task.title,
            'parentId': task.parentId,
            'timeEstimate': task.time,
        });
    } catch (err) {
        console.log(err);
    }
}

const getTodayTasks = async () => {
    if (todayTasks.length) {
        return todayTasks;
    }

    try {
        const todayResponse = await axios.get(marvinApiBaseUrl + 'todayItems');

        if (todayResponse.status === 200) {
            todayTasks = todayResponse.data;
        }

        return todayTasks;
    } catch (err) {
        console.log(err);
    }
}

const isValidCreatedTask = (createdTask) => {
    return createdTask && createdTask.status === 200;
}

const isTaskAlreadyExisting = async (task) => {
    for (const todayTask of await getTodayTasks()) {
        if (todayTask.title === task.rawTitle) {
            return true;
        }
    }

    return false;
}

module.exports = {
    createMarvinTask: createMarvinTask,
    isValidCreatedTask: isValidCreatedTask,
    isTaskAlreadyExisting: isTaskAlreadyExisting,
}
