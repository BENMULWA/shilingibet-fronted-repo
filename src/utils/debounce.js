import { debounce } from "lodash";

export const debouncedWithdraw = debounce((withdrawAmount, callback) => {
  callback(withdrawAmount);
}, 100);
