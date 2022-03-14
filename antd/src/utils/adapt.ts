// 响应式处理方式

interface AdaptWidth {
  elContainer: number;
  labelWidth: number;
  adminLabelWidth: number;
  tableHeight: number;
}

export function adapt() {
  const clientWidth = document.body.clientWidth;
  const adaptWidth = {} as AdaptWidth;
  if (clientWidth > 1000) {
    adaptWidth.elContainer = 20;
    adaptWidth.labelWidth = 180;
    adaptWidth.adminLabelWidth = 110;
    adaptWidth.tableHeight = 600;
  } else {
    adaptWidth.elContainer = 22;
    adaptWidth.labelWidth = 80;
    adaptWidth.adminLabelWidth = 80;
    adaptWidth.tableHeight = 350;
  }
  return adaptWidth;
}
