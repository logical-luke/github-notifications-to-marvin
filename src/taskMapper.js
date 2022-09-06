const companyCategoryId = process.env.COMPANY_CATEGORY_ID;
const personalCategoryId = process.env.PERSONAL_CATEGORY_ID;
const companyRepoOwner = process.env.COMPANY_REPO_OWNER;

const secondInMs = 1000;
const minuteInSeconds = secondInMs * 60;
const reviewTimeEstimate = minuteInSeconds * 15;
const messageCheckTimeEstimate = minuteInSeconds * 5;

const reviewVerb = 'Review';
const checkVerb = 'Check';

const reviewRequested = 'review_requested';

const isReview = (notification) => {
    return notification.reason === reviewRequested && !notification.is_merged;
}

const getActionVerb = (notification) => {
    return isReview(notification) ? reviewVerb : checkVerb;
}

const getTimeEstimate = (notification) => {
    return isReview(notification) ? reviewTimeEstimate : messageCheckTimeEstimate;
}

const getCategoryId = (notification) => {
    return notification.repository.owner.login === companyRepoOwner ? companyCategoryId : personalCategoryId;
}

const getTitle = (notification) => {
    return `+today @Review ${getRawTitle(notification)}`;
}

const getRawTitle = (notification) => {
    return `${getActionVerb(notification)} "${notification.subject.title}" PR`;
}

const getNote = (notification) => {
    return `${notification.subject.url}`
}

const mapNotificationOnTask = async (notification) => {
    return {
        title: getTitle(notification),
        parentId: getCategoryId(notification),
        time: getTimeEstimate(notification),
        rawTitle: getRawTitle(notification),
        note: getNote(notification),
    };
}

module.exports = {
    mapNotificationOnTask: mapNotificationOnTask
}
