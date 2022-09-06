require('dotenv').config();

const github = require('./githubClient');
const marvin = require('./marvinClient');
const taskMapper = require('./taskMapper');

const secondInMs = 1000;
const notificationPushInterval = secondInMs * process.env.PUSH_INTERVAL_SECONDS;

const pushTasksFromNotifications = async () => {
    setTimeout(async () => {
        const notifications = await github.getNotifications();
        console.log(`Pulled ${notifications.length} notifications`);
        for (const notification of notifications) {
            const newTask = await taskMapper.mapNotificationOnTask(notification);

            if (await marvin.isTaskAlreadyExisting(newTask)) {
                console.log(`Task ${newTask.rawTitle} already exists. Skipping`);

                continue;
            }

            const createdTask = await marvin.createMarvinTask(newTask);

            if (marvin.isValidCreatedTask(createdTask)) {
                console.log(`Created successfully a new task ${createdTask.data.title}`);
                await github.markNotificationAsRead(notification.id);
            }
        }

        await pushTasksFromNotifications();
    }, notificationPushInterval)
}

(async () => {
    console.log('Starting script');

    await pushTasksFromNotifications();
})();
