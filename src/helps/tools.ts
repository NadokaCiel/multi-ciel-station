export function awaitWrap<T, U = any>(
  promise: Promise<T>,
): Promise<[U | null, T | null]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, any]>((err) => [err, { data: null }]);
}

export function dateFormat(millisecond: number, fmt: string): string {
  let str = fmt;
  const date = new Date(millisecond);
  if (!date || date.toString() === "Invalid Date") {
    return "";
  }
  const o: any = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  if (/(y+)/.test(str)) {
    str = str.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }

  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(str)) {
      str = str.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  });

  return str;
}

export function compareVersion(v1, v2) {
  const s1 = v1.split(".");
  const s2 = v2.split(".");
  const len = Math.max(s1.length, s2.length);
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(s1[i] || "0");
    const num2 = parseInt(s2[i] || "0");
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}
