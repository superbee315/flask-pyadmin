import type { BasicColumn, ActionItem } from '/@/components/Table';

import { FileItem, PreviewFileItem } from '/@/components/Upload/src/types';
import {
  // checkImgType,
  isImgTypeByName,
} from '/@/components/Upload/src/helper';

import TableAction from '/@/components/Table/src/components/TableAction.vue';
import ThumbUrl from '/@/components/customComponents/ThumbUrl.vue';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 文件上传列表
export function createTableColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'thumbUrl',
      title: t('component.upload.legend'),
      width: 70,
      customRender: ({ record }) => {
        const { thumbUrl } = (record as FileItem) || {};
        return thumbUrl && <ThumbUrl fileUrl={thumbUrl} />;
      },
    },
    {
      title: t('component.upload.fileName'),
      dataIndex: 'name',
      editRow: true,
      width: 120,
    },
    {
      dataIndex: 'size',
      title: t('component.upload.fileSize'),
      width: 80,
      customRender: ({ text = 0 }) => {
        return text && (text / 1024).toFixed(2) + 'KB';
      },
    },
    {
      dataIndex: 'type',
      title: '文件类型',
      width: 80,
    },
    {
      title: '上传日期',
      dataIndex: 'time',
      editRow: true,
      width: 120,
    },
  ];
}
export function createActionColumn(handleRemove: Function): BasicColumn {
  return {
    width: 120,
    title: t('component.upload.operating'),
    dataIndex: 'action',
    fixed: false,
    customRender: ({ record }) => {
      const actions: ActionItem[] = [
        {
          label: t('component.upload.del'),
          icon: 'ic:outline-delete-outline',
          color: 'error',
          onClick: handleRemove.bind(null, record),
        },
      ];
      // if (checkImgType(record)) {
      //   actions.unshift({
      //     label: t('component.upload.preview'),
      //     onClick: handlePreview.bind(null, record),
      //   });
      // }
      return <TableAction actions={actions} outside={true} />;
    },
  };
}
// 文件预览列表
export function createPreviewColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'url',
      title: t('component.upload.legend'),
      width: 100,
      customRender: ({ record }) => {
        const { url } = (record as PreviewFileItem) || {};
        return isImgTypeByName(url) && <ThumbUrl fileUrl={url} />;
      },
    },
    {
      dataIndex: 'name',
      title: t('component.upload.fileName'),
      align: 'left',
    },
  ];
}

export function createPreviewActionColumn(
  handleRemove,
  handlePreview,
  handleDownload
): BasicColumn {
  return {
    width: 100,
    title: t('component.upload.operating'),
    dataIndex: 'action',
    fixed: false,
    customRender: ({ record }) => {
      // const { url } = (record || {}) as PreviewFileItem;

      const actions: ActionItem[] = [
        {
          label: t('component.upload.preview'),
          icon: 'ant-design:eye-outlined',
          onClick: handlePreview.bind(null, record),
        },
        {
          label: t('component.upload.del'),
          color: 'error',
          icon: 'ic:outline-delete-outline',
          onClick: handleRemove.bind(null, record),
        },
        {
          label: t('component.upload.download'),
          color: 'success',
          icon: 'ic:outline-download',
          onClick: handleDownload.bind(null, record),
        },
      ];
      // if (isImgTypeByName(url)) {
      //   actions.unshift({
      //     label: t('component.upload.preview'),
      //     onClick: handlePreview.bind(null, record),
      //   });
      // }
      return <TableAction actions={actions} outside={true} />;
    },
  };
}
