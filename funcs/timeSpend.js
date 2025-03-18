import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/uk';

dayjs.extend(relativeTime);
dayjs.locale('uk');

export const timeSince = time => dayjs(time).fromNow();

export default function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} сек`;
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(2)} мин`;
  } else {
    return `${(seconds / 3600).toFixed(2)} ч`;
  }
}
