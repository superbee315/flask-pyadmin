<template>
  <Card title="会员概况">
    <template #extra>
      <a-button type="link" size="small" @click="toMember">前往查看</a-button>
    </template>
    <div :style="{ width, height }">
      <ScrollContainer>
        <div>
          <div class="flex item-wrap">
            <div class="item-title">会员总数</div>
            <div class="item-value">{{ data.user_count }}</div>
          </div>
          <div class="flex item-wrap">
            <div class="item-title">个人总数</div>
            <div class="item-value">{{ data.person_count }}</div>
          </div>
          <div class="flex item-wrap">
            <div class="item-title">单位总数</div>
            <div class="item-value">{{ data.unit_count }}</div>
          </div>
          <div class="flex item-wrap">
            <div class="item-title">本年会费缴纳</div>
            <div class="item-value">{{ data.now_dues }}%</div>
          </div>
          <div class="flex item-wrap">
            <div class="item-title">本年会议参会率</div>
            <div class="item-value">{{ data.now_meeting }}%</div>
          </div>
        </div>
      </ScrollContainer>
    </div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { ScrollContainer } from '/@/components/Container/index';
  import { Card } from 'ant-design-vue';
  import { router } from '/@/router';
  import { getDashboardUser } from '/@/api/sys/dashboard';

  interface Data {
    data: {
      user_count: number;
      person_count: number;
      unit_count: number;
      now_dues: number;
      now_meeting: number;
    };
  }
  export default defineComponent({
    components: { Card, ScrollContainer },
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      },
      // data: {
      //   type: Array as PropType<DataType[]>,
      //   default: () => [
      //     { id: 1, title: '会员总数', value: '120' },
      //     { id: 2, title: '个人总数', value: '120' },
      //     { id: 3, title: '单位总数', value: '120' },
      //     { id: 4, title: '本年会费缴纳', value: '70%' },
      //     { id: 5, title: '本年会议参会率', value: '60%' },
      //     { id: 6, title: '本年活动参会率', value: '50%' },
      //   ],
      // },
    },
    setup() {
      const state = reactive<Data>({
        data: {
          user_count: 0,
          person_count: 0,
          unit_count: 0,
          now_dues: 0,
          now_meeting: 0,
        },
      });
      init();
      function init() {
        getDashboardUser().then((res) => {
          state.data = res.row as any;
        });
      }
      function toMember() {
        router.push({ name: 'Member' });
      }
      return {
        toMember,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .item-wrap {
    margin: 15px 20px;
    font-size: 18px;
  }
  .item-title {
    width: 60%;
  }
  .item-value {
    font-weight: 600;
    /* font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; */
    color: rgb(224, 45, 45);
  }
</style>
