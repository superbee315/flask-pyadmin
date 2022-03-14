interface Op {
  key: string;
  type: string;
}

export const OpsCreater = function (ops: Op[], params) {
  const op = {};
  ops.map((item) => {
    if (params.filter && params.filter[item.key]) {
      op[item.key] = item.type;
    }
  });
  return op;
};
