function isExist(list, child) {
  let flag = true;
  list.forEach((item) => {
    if (item.id === child.id) {
      flag = false;
    }
  });
  return flag;
}

export function listToTree(oldArr) {
  oldArr.forEach((element) => {
    const parent = element.parent;
    if (parent !== null) {
      oldArr.forEach((ele) => {
        if (ele.id === parent) {
          //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
          if (!ele.children) {
            ele.children = [];
          }
          if (isExist(ele.children, element)) {
            ele.children.push(element);
          }
        }
      });
    }
  });
  oldArr = oldArr.filter((ele) => ele.parent === null); //这一步是过滤，按树展开，将多余的数组剔除；
  return oldArr;
}
