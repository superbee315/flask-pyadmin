<template>
  <Card title="账户管理" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small" @click="toBill">更多</a-button>
    </template>

    <div :style="{ width, height }">
      <a-carousel arrows :autoplay="false" :after-change="onChange" :dots="false">
        <template #prevArrow>
          <div
            v-if="!isPhone && chartData?.accounts.length > 1"
            class="custom-slick-arrow"
            style="left: 10px; z-index: 1"
          >
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div
            v-if="!isPhone && chartData?.accounts.length > 1"
            class="custom-slick-arrow"
            style="right: 10px"
          >
            <right-circle-outlined />
          </div>
        </template>
        <div v-for="item in chartData?.accounts" :key="item.name">
          <h3 style="color: #001529; text-align: center; font-size: 16px; font-weight: bold"
            >{{ item.name }}
            <BasicHelp v-if="isPhone" text="滑动切换切换账户" :class="`${prefixCls}__help`"
          /></h3>
          <div :style="{ width, height: chartHeight }" :ref="setItemRef"> </div>
        </div>
      </a-carousel>

      <!-- 暂无数据时显示 -->
      <List v-if="chartData?.accounts.length === 0" item-layout="horizontal" :data-source="[]" />
    </div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, toRefs, watch } from 'vue';
  import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
  import { Card, Carousel, List } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { router } from '/@/router';
  import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    components: {
      Card,
      [Carousel.name]: Carousel,
      LeftCircleOutlined,
      RightCircleOutlined,
      BasicHelp,
      List,
    },
    props: {
      loading: Boolean,
      chartData: Object,
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-header-cell');
      const chartRef = ref<HTMLDivElement | null>(null);
      // const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
      const isPhone = ref<Boolean>(false);
      const chartHeight = ref<string>('280px');

      //手机端兼容
      const clientWidth = document.documentElement.clientWidth;
      if (clientWidth < 600) {
        isPhone.value = true;
        chartHeight.value = '240px';
      } else {
        isPhone.value = false;
        chartHeight.value = '280px';
      }

      const itemRefs = ref<HTMLDivElement[]>([]);
      const setItemRef = (el: HTMLDivElement) => {
        if (el && !itemRefs.value.includes(el)) {
          itemRefs.value.push(el);
        }
      };

      watch(
        () => props.loading,
        () => {
          if (props.loading) {
            return;
          }
          itemRefs.value.forEach((item) => {
            // item 即为对应的组件ref
            // 可通过 item 获取对应组件上的属性或方法
            const { setOptions } = useECharts(item as any);
            //初始化图表
            setOptions(getOptions(0) as any);
          });
        },
        { immediate: true }
      );

      function getOptions(index: number) {
        let options = {};
        if (clientWidth < 600) {
          options = {
            tooltip: {
              trigger: 'item',
            },
            color: [
              '#c23531',
              '#2f4554',
              '#61a0a8',
              '#d48265',
              '#91c7ae',
              '#749f83',
              '#ca8622',
              '#bda29a',
              '#6e7074',
              '#546570',
              '#c4ccd3',
            ],
            title: [
              {
                text:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '收入情况',
                left: '1%',
                bottom: '2%',
                textStyle: {
                  color: '#000',
                  fontSize: 12,
                },
              },
              {
                text:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '支出情况',
                left: '55%',
                bottom: '2%',
                textStyle: {
                  color: '#000',
                  fontSize: 12,
                },
              },
            ],
            series: [
              {
                name:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '收入情况',
                type: 'pie',
                radius: '40%',
                center: ['20%', '58%'],
                // color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
                data: props.chartData?.accounts[index].in,
                // roseType: 'radius',
                // animationType: 'scale',
                // animationEasing: 'exponentialInOut',
                // animationDelay: function () {
                //   return Math.random() * 400;
                // },
              },
              {
                name:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '支出情况',
                type: 'pie',
                radius: '40%',
                center: ['80%', '58%'],
                // color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
                data: props.chartData?.accounts[index].out,
                // roseType: 'radius',
                // animationType: 'scale',
                // animationEasing: 'exponentialInOut',
                // animationDelay: function () {
                //   return Math.random() * 400;
                // },
              },
            ],
          };
        } else {
          options = {
            tooltip: {
              trigger: 'item',
            },
            title: [
              {
                text:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '收入情况',
                left: '24%',
                bottom: '1%',
                textStyle: {
                  color: '#000',
                  fontSize: 14,
                },
              },
              {
                text:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '支出情况',
                left: '65%',
                bottom: '1%',
                textStyle: {
                  color: '#000',
                  fontSize: 14,
                },
              },
            ],
            series: [
              {
                name:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '支出情况',
                type: 'pie',
                radius: '70%',
                center: ['70%', '45%'],
                // color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
                data: props.chartData?.accounts[index].out,
              },
              {
                name:
                  props.chartData?.month +
                  '月' +
                  props.chartData?.accounts[index].name +
                  '收入情况',
                type: 'pie',
                radius: '70%',
                center: ['30%', '45%'],
                // color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
                data: props.chartData?.accounts[index].in,
              },
            ],
          };
        }
        return options;
      }

      function toBill() {
        router.push({ name: 'Account' });
      }

      //切换账户, 图表更新
      function onChange(index) {
        itemRefs.value.forEach((item) => {
          // item 即为对应的组件ref
          // 可通过 item 获取对应组件上的属性或方法
          const { setOptions } = useECharts(item as any);
          setOptions(getOptions(index));
        });
      }

      return {
        onChange,
        chartRef,
        toBill,
        setItemRef,
        prefixCls,
        isPhone,
        chartHeight,
        ...toRefs(props),
      };
    },
  });
</script>
<style scoped lang="less">
  /* For demo */
  // .ant-carousel :deep(.slick-slide) {
  //   /* text-align: center; */
  //   /* height: 160px; */
  //   /* line-height: 160px; */
  //   /* background: #364d79; */
  //   /* overflow: hidden; */
  // }

  .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.5);
    opacity: 0.3;
  }
  .ant-carousel :deep(.custom-slick-arrow:before) {
    display: none;
  }
  .ant-carousel :deep(.custom-slick-arrow:hover) {
    opacity: 0.5;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }

  @prefix-cls: ~'@{namespace}-basic-table-header-cell';

  .@{prefix-cls} {
    &__help {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
</style>
