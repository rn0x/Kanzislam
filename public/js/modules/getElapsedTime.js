export default function getElapsedTime(updatedAt) {
    const now = new Date();
    const timeDifference = now - new Date(updatedAt);

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

    if (minutes < 60) {
        return "منذ " + minutes + " دقائق";
    } else if (hours < 24) {
        return "منذ " + hours + " ساعة و " + (minutes % 60) + " دقيقة";
    } else if (days < 30) {
        return "منذ " + days + " يوم و " + (hours % 24) + " ساعة";
    } else if (months < 12) {
        return "منذ " + months + " شهر و " + (days % 30) + " يوم";
    } else {
        return "منذ " + years + " سنة و " + (months % 12) + " شهر";
    }
}  