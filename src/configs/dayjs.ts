import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";

dayjs.extend(jalaliday).calendar("jalali");
