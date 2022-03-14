<template>
  <PageWrapper>
    <template #headerContent> <WorkbenchHeader /> </template>
    <div class="lg:flex">
      <div class="lg:w-4/10 w-full !mr-4 enter-y">
        <ContentSurvey class="!my-2 enter-y" />
      </div>
      <div class="lg:w-6/10 w-full enter-y">
        <AccountChart :loading="loading" :chart-data="chartData" class="!my-2 enter-y" />
      </div>
    </div>
    <div class="lg:flex">
      <div class="lg:w-3/10 w-full !mr-4 enter-y">
        <MemberSurvey class="!my-2 enter-y" />
      </div>
      <div class="lg:w-7/10 w-full enter-y">
        <RecentAnnouncement class="!my-2 enter-y" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import AccountChart from './components/AccountChart.vue';
  import ContentSurvey from './components/ContentSurvey.vue';
  import RecentAnnouncement from './components/RecentAnnouncement.vue';
  import MemberSurvey from './components/MemberSurvey.vue';
  // import { getAccountList, getDuesList, getMonthBill } from '/@/api/sys/bill';
  import { getBillInfoList } from '/@/api/sys/dashboard';

  export default defineComponent({
    components: {
      PageWrapper,
      WorkbenchHeader,
      AccountChart,
      ContentSurvey,
      RecentAnnouncement,
      MemberSurvey,
    },
    setup() {
      const state = reactive({
        chartData: {
          month: 1,
          accounts: [],
        },
      });
      const loading = ref(true);

      setTimeout(() => {
        loading.value = false;
      }, 1000);
      init();
      async function init() {
        getBillInfoList().then((res) => {
          state.chartData = res.row as any;
          console.log(`res`, res);
        });
      }

      return {
        loading,
        ...toRefs(state),
      };
    },
  });
</script>
