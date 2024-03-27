export const getTimeLeft = (stamp: number) => {
  const now = new Date().getTime();
  const difference = stamp - now;


  if (difference <= 0) {
    return `00,00,00,00`;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const formattedDays = days < 10 ? '0' + days : days;
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  return `${formattedDays},${formattedHours},${formattedMinutes},${formattedSeconds}`;
}

export const getTimeSince = (date: number) => {
  const currentDate = new Date();
  const timeElapsed = currentDate.valueOf() - new Date(date).valueOf();
  const seconds = Math.floor(timeElapsed / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const inputYear = new Date(date).getFullYear();
  const inputMonth = new Date(date).getMonth();
  const yearDifference = currentYear - inputYear;
  const monthDifference = currentMonth - inputMonth;
  if (yearDifference === 0) {
    if (monthDifference === 1) {
      return '1 month ago';
    } else {
      return `${monthDifference} months ago`;
    }
  } else if (yearDifference === 1 && monthDifference < 0) {
    return '11 months ago';
  } else {
    if (yearDifference === 1) {
      return '1 year ago';
    } else {
      return `${yearDifference} years ago`;
    }
  }
}

export const getUnixStamp = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const unixTimestamp = dateObj.getTime();

  return unixTimestamp;
}

export const getDateStamp = (stamp: number) => {
  const date = new Date(stamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getHourGap = (stamp: number) => {
  const date2 = new Date().getTime();
  const hourDifference = (date2 - stamp) / 36e5;
  return Math.floor(hourDifference);
}

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export const getRealDate = (timestamp: number) => {
  const dt = new Date(timestamp);
  dt.setDate(dt.getDate());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dt.getMonth()];

  const formattedDate = `${dt.getDate()}${getOrdinalSuffix(dt.getDate())} ${month}, ${dt.getFullYear()}`;
  return formattedDate;
}

export const getOrderDeadline = (timestamp: number): string => {
  const dt = new Date(timestamp);
  dt.setDate(dt.getDate() + 2);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dt.getMonth()];

  const formattedDate = `${dt.getDate()}${getOrdinalSuffix(dt.getDate())} ${month}, ${dt.getFullYear()}`;
  return formattedDate;
}