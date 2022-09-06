const github = require('octonode');

let client = github.client(process.env.GITHUB_TOKEN);

const getNotifications = async () => {
    let notifications = [];

    try {
        const notificationsResponse = await client.me().notificationsAsync({});

        for (let notification of notificationsResponse[0]) {
            notification.is_merged = await isPrClosed(
                notification.repository.full_name,
                getPrIdFromUrl(notification.subject.url, notification.repository.url),
            );
            notification.subject.web_url = await getWebUrl(
                notification.repository.full_name,
                getPrIdFromUrl(notification.subject.url, notification.repository.url),
            );
            notifications.push(notification);
        }
    } catch (err) {
        console.log(err);
    }

    return notifications;
}

const markNotificationAsRead = async (id) => {
    let response = [[]];

    try {
        response = await client.notification(id).markAsReadAsync();
    } catch (err) {
        console.log(err);
    }

    return response[0];
}

const isPrClosed = async (repo, id) => {
    return await getPr(repo, id).state === 'closed';
}

const getWebUrl = async (repo, id) => {
    const pr = await getPr(repo, id);

    return pr.html_url;
}

const getPr = async (repo, id) => {
    let pr = {};

    try {
        const response = await client.pr(repo, parseInt(id)).infoAsync();

        if (response[0]) {
            pr = response[0];
        }
    } catch (err) {
        console.log(err);
    }

    return pr;
}

const getPrIdFromUrl = (url, repoUrl) => {
    return url.replace(repoUrl + '/pulls/', '');
}

module.exports = {
    getNotifications: getNotifications,
    markNotificationAsRead: markNotificationAsRead,
}
