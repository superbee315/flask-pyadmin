<template>
  <Card title="近期公告" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small" @click="toContent">更多</a-button>
    </template>

    <div :style="{ width, height }">
      <ScrollContainer>
        <List item-layout="horizontal" :data-source="items">
          <template #renderItem="{ item }">
            <ListItem @click="toDetail(item)">
              <ListItemMeta>
                <template #description>
                  <Tag color="green">{{ item.category }}</Tag>
                  <!-- {{ moment(item.updatetime * 1000).format('YYYY-MM-DD HH:mm:ss') }} -->
                  {{ getDateDiff(item.updatetime) }}
                </template>
                <template #title>
                  <span style="font-size: large">{{ item.title }}</span></template
                >
              </ListItemMeta>
            </ListItem>
          </template>
        </List>
      </ScrollContainer>
    </div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container/index';
  import { Card, List, Tag } from 'ant-design-vue';
  import { getContentList } from '/@/api/sys/content';
  import moment from 'moment';
  import { router } from '/@/router';
  import { getDateDiff } from '/@/utils/formatTime';

  interface Content {
    title: string;
    category: string;
    content?: string;
    updatetime: number;
    createtime?: number;
  }

  export default defineComponent({
    components: {
      Card,
      Tag,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      ScrollContainer,
    },
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      },
    },
    setup() {
      const announcements = ref<Content[]>([]);
      init();
      function init() {
        getContentList(null).then((res) => {
          const list: Content[] = [];
          res.list.map((item) => {
            if (item.category == '公告') {
              list.push(item);
            }
          });
          announcements.value = list;
        });
      }
      function toDetail(item) {
        router.push({ name: 'Content', params: { id: item.id } });
      }

      function toContent() {
        router.push({ name: 'Content' });
      }
      return { toContent, getDateDiff, toDetail, items: announcements, moment };
    },
  });
</script>
