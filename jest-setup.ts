global.structuredClone = function (val: unknown) {
  return JSON.parse(JSON.stringify(val));
};
