<template>
  <div ref="wrapRef" :class="getWrapperClass">
    <Table
      ref="tableElRef"
      class="mytable"
      v-bind="getBindValues"
      :rowClassName="getRowClassName"
      v-show="getEmptyDataIsShowTable"
      @change="handleTableChange"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>

      <template #[`header-${column.dataIndex}`] v-for="column in columns" :key="column.dataIndex">
        <HeaderCell :column="column" />
      </template>
    </Table>
  </div>
</template>
<script lang="ts">
  import type {
    BasicTableProps,
    TableActionType,
    SizeType,
    ColumnChangeParam,
  } from './types/table';

  import { defineComponent, ref, computed, unref, toRaw, onMounted, reactive, toRefs } from 'vue';
  import { Table } from 'ant-design-vue';
  import expandIcon from './components/ExpandIcon';
  import HeaderCell from './components/HeaderCell.vue';
  import { InnerHandlers } from './types/table';

  import { usePagination } from './hooks/usePagination';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { useLoading } from './hooks/useLoading';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useCustomRow } from './hooks/useCustomRow';
  import { useTableStyle } from './hooks/useTableStyle';
  import { useTableHeader } from './hooks/useTableHeader';
  import { createTableContext } from './hooks/useTableContext';
  import { useTableFooter } from './hooks/useTableFooter';
  import { useExpose } from '/@/hooks/core/useExpose';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { omit } from 'lodash-es';
  import { basicProps } from './props';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    components: {
      Table,
      HeaderCell,
    },
    props: basicProps,
    emits: [
      'fetch-success',
      'fetch-error',
      'selection-change',
      'register',
      'dragRow',
      'row-click',
      'row-dbClick',
      'row-contextmenu',
      'row-mouseenter',
      'row-mouseleave',
      'edit-end',
      'edit-cancel',
      'edit-row-end',
      'edit-change',
      'expanded-rows-change',
      'change',
      'columns-change',
    ],
    setup(props, { attrs, emit, slots }) {
      const formState = reactive({
        showSearch: false,
      });
      const tableElRef = ref<ComponentRef>(null);
      const tableData = ref<Recordable[]>([]);

      const wrapRef = ref<Nullable<HTMLDivElement>>(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();

      const { prefixCls } = useDesign('basic-table');

      const getProps = computed(() => {
        return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
      });

      const { getLoading, setLoading } = useLoading(getProps);
      const {
        getPaginationInfo,
        getPagination,
        setPagination,
        setShowPagination,
        getShowPagination,
      } = usePagination(getProps);

      const {
        getRowSelection,
        getRowSelectionRef,
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys,
      } = useRowSelection(getProps, tableData, emit);

      const {
        handleTableChange: onTableChange,
        getDataSourceRef,
        getDataSource,
        setTableData,
        updateTableDataRecord,
        getRowKey,
        getAutoCreateKey,
        updateTableData,
      } = useDataSource(
        getProps,
        {
          tableData,
          getPaginationInfo,
          setLoading,
          setPagination,
          clearSelectedRowKeys,
        },
        emit
      );

      function handleTableChange(...args) {
        onTableChange.call(undefined, ...args);
        emit('change', ...args);
        // 解决通过useTable注册onChange时不起作用的问题
        const { onChange } = unref(getProps);
        onChange && isFunction(onChange) && onChange.call(undefined, ...args);
      }

      const {
        getViewColumns,
        getColumns,
        setCacheColumnsByField,
        setColumns,
        getColumnsRef,
        getCacheColumns,
      } = useColumns(getProps, getPaginationInfo);

      const { getScrollRef, redoHeight } = useTableScroll(
        getProps,
        tableElRef,
        getColumnsRef,
        getRowSelectionRef,
        getDataSourceRef
      );

      const { customRow } = useCustomRow(getProps, {
        setSelectedRowKeys,
        getSelectRowKeys,
        clearSelectedRowKeys,
        getAutoCreateKey,
        emit,
      });

      const { getRowClassName } = useTableStyle(getProps, prefixCls);

      const handlers: InnerHandlers = {
        onColumnsChange: (data: ColumnChangeParam[]) => {
          emit('columns-change', data);
          // support useTable
          unref(getProps).onColumnsChange?.(data);
        },
      };

      const { getHeaderProps } = useTableHeader(getProps, slots, handlers);

      const { getFooterProps } = useTableFooter(
        getProps,
        getScrollRef,
        tableElRef,
        getDataSourceRef
      );

      const getBindValues = computed(() => {
        const dataSource = unref(getDataSourceRef);
        let propsData: Recordable = {
          size: 'middle',
          // ...(dataSource.length === 0 ? { getPopupContainer: () => document.body } : {}),
          ...attrs,
          customRow,
          expandIcon: expandIcon(),
          ...unref(getProps),
          ...unref(getHeaderProps),
          scroll: unref(getScrollRef),
          loading: unref(getLoading),
          tableLayout: 'fixed',
          rowSelection: unref(getRowSelectionRef),
          rowKey: unref(getRowKey),
          columns: toRaw(unref(getViewColumns)),
          pagination: toRaw(unref(getPaginationInfo)),
          dataSource,
          footer: unref(getFooterProps),
        };
        if (slots.expandedRowRender) {
          propsData = omit(propsData, 'scroll');
        }

        propsData = omit(propsData, ['class', 'onChange']);
        return propsData;
      });

      const getWrapperClass = computed(() => {
        const values = unref(getBindValues);
        // 显示 表格搜索字段
        // formState.showSearch = values.useSearchForm;
        return [
          prefixCls,
          attrs.class,
          {
            [`${prefixCls}-form-container`]: values.useSearchForm,
            [`${prefixCls}--inset`]: values.inset,
          },
        ];
      });

      const getEmptyDataIsShowTable = computed(() => {
        const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
        if (emptyDataIsShowTable || !useSearchForm) {
          return true;
        }
        return !!unref(getDataSourceRef).length;
      });

      function setProps(props: Partial<BasicTableProps>) {
        innerPropsRef.value = { ...unref(innerPropsRef), ...props };
      }

      const tableAction: TableActionType = {
        getSelectRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setPagination,
        setTableData,
        updateTableDataRecord,
        redoHeight,
        setSelectedRowKeys,
        setColumns,
        setLoading,
        getDataSource,
        setProps,
        getRowSelection,
        getPaginationRef: getPagination,
        getColumns,
        getCacheColumns,
        emit,
        updateTableData,
        setShowPagination,
        getShowPagination,
        setCacheColumnsByField,
        getSize: () => {
          return unref(getBindValues).size as SizeType;
        },
        showTableSearch: () => {
          formState.showSearch = !formState.showSearch;
          // 重新调整表格高度
          redoHeight();
        },
      };
      createTableContext({ ...tableAction, wrapRef, getBindValues });

      useExpose<TableActionType>(tableAction);

      emit('register', tableAction);

      onMounted(() => {
        if (!props.canDragRow) {
          return;
        }
      });
      return {
        tableElRef,
        getBindValues,
        getLoading,
        getEmptyDataIsShowTable,
        handleTableChange,
        getRowClassName,
        wrapRef,
        tableAction,
        redoHeight,
        getWrapperClass,
        columns: getViewColumns,
        ...toRefs(formState),
      };
    },
  });
</script>
<style lang="less">
  @border-color: #cecece4d;

  @prefix-cls: ~'@{namespace}-basic-table';

  .@{prefix-cls} {
    max-width: 100%;

    &-row__striped {
      td {
        background-color: @app-content-background;
      }
    }

    &-form-container {
      padding: 16px;

      .ant-form {
        padding: 12px 10px 6px 10px;
        margin-bottom: 16px;
        background-color: @component-background;
        border-radius: 2px;
      }
    }

    &--inset {
      .ant-table-wrapper {
        padding: 0;
      }
    }

    .ant-tag {
      margin-right: 0;
    }

    .ant-table-wrapper {
      padding: 6px;
      background-color: @component-background;
      border-radius: 2px;

      .ant-table-title {
        min-height: 40px;
        padding: 0 0 8px 0 !important;
      }

      .ant-table.ant-table-bordered .ant-table-title {
        border: none !important;
      }
    }

    .ant-table {
      width: 100%;
      overflow-x: hidden;

      &-title {
        display: flex;
        padding: 8px 6px;
        border-bottom: none;
        justify-content: space-between;
        align-items: center;
      }

      .ant-table-tbody > tr.ant-table-row-selected td {
        background-color: fade(@primary-color, 8%) !important;
      }
    }

    .ant-pagination {
      margin: 10px 0 0 0;
    }

    .ant-table-footer {
      padding: 0;

      .ant-table-wrapper {
        padding: 0;
      }

      table {
        border: none !important;
      }

      .ant-table-body {
        overflow-x: hidden !important;
        overflow-y: scroll !important;
      }

      td {
        padding: 12px 8px;
      }
    }
  }
</style>
