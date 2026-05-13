import dayjs from "dayjs";

import durationPlugin from "dayjs/plugin/duration";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);
dayjs.extend(isBetween);
