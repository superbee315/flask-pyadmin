/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
// const DATE_FORMAT = 'YYYY-MM-DD ';
const DATE_TIME_SECOND_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function formatToDateTime(
  date: moment.MomentInput = null,
  format = DATE_TIME_FORMAT
): string {
  return moment(date).format(format);
}

export function formatToDate(
  date: moment.MomentInput = null,
  format = DATE_TIME_SECOND_FORMAT
): string {
  return moment(date).format(format);
}

export const dateUtil = moment;
