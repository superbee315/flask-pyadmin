<template>
  <div>
    <div style="display: flex">
      <Input class="upload-input" :value="imageUrls" disabled />
      <BasicUpload
        :maxSize="20"
        :maxNumber="imgNum"
        @change="handleChange"
        :api="uploadApi"
        :accept="['jpg', 'jpeg', 'gif', 'png', 'webp']"
        class="my-3"
      />
      <a-button
        @click="openChooseModal"
        style="position: relative; top: 12px; margin: 0 5px"
        type="danger"
        preIcon="ic:sharp-view-list"
        :iconSize="16"
      >
        选择
      </a-button>
      <span class="tip-span" v-if="tipShow">{{ tip }}</span>
    </div>

    <div class="image-list" v-if="file_list.length">
      <div v-for="(item, index) in file_list" :key="index">
        <div class="image-item" v-if="item !== ''">
          <div class="image-wrap"> <a-image width="70px" :src="imgUrlPrefix + item" /></div>
          <div class="dele-image" @click="deleteImage(index)">
            <Icon icon="ri:delete-bin-5-fill" />
          </div>
        </div>
      </div>
    </div>
    <ChooseModal :type="type" @register="chooseModalRegister" @checked="checked" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, watch, reactive, toRefs, ref } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { uploadApi } from '/@/api/sys/upload';
  import ChooseModal from './ChooseModal.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useModal } from '/@/components/Modal';
  import { Image, Input } from 'ant-design-vue';
  import Icon from '/@/components/Icon';

  const props = {
    value: { type: String, default: '' },
    tip: { type: String, default: '' },
    type: { type: String, default: '' },
    errMsg: { type: String, default: '' },
    rules: { type: Array, default: [] },
  };
  interface PropsType {
    value: string;
    tip: string;
    type: string;
    errMsg: string;
    rules: [];
  }
  export default defineComponent({
    components: { BasicUpload, ChooseModal, aImage: Image, Input, Icon },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const imgNum = ref(1);
      if (props.type === 'images') {
        imgNum.value = 10;
      }
      // const { createMessage } = useMessage();
      const { imgUrlPrefix } = useGlobSetting();
      const [chooseModalRegister, { openModal }] = useModal();
      function openChooseModal() {
        openModal(true);
      }
      const state = reactive({
        imageUrls: props.value,
        file_list: [] as string[],
        tipShow: false,
      });
      state.file_list = props.value.split(',');
      function deleteImage(index) {
        const arr = state.imageUrls.split(',');
        // arr.splice(
        //   arr.findIndex((item) => item === url),
        //   1
        // );
        arr.splice(index, 1);
        state.imageUrls = arr.toString();
        emit('change', state.imageUrls);
      }
      function checked(imgs) {
        if (props.type === 'image') {
          state.imageUrls = imgs[0].url;
        } else {
          let urls: string[] = [];
          imgs.map((item) => {
            urls.push(item.url);
          });
          state.imageUrls += ',' + urls.toString();
        }
        emit('change', state.imageUrls);
      }

      watch(props, (props: PropsType) => {
        state.file_list = props.value.split(',');
      });

      return {
        handleChange: (list: string[]) => {
          if (props.type === 'image') {
            state.imageUrls = list[0];
          } else {
            state.imageUrls = list.toString();
          }
          emit('change', state.imageUrls);
        },
        imgNum,
        checked,
        imgUrlPrefix,
        openChooseModal,
        deleteImage,
        uploadApi,
        chooseModalRegister,
        openModal,
        ...toRefs(props),
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped>
  .upload-input {
    position: relative;
    top: 11px;
    width: 45%;
    height: 34px;
    margin-right: 5px;
  }

  .image-list {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
  }

  .image-item {
    width: 120px;
    margin: 0 5px;
    text-align: center;
  }

  .image-wrap {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 80px;
    border: 1px solid #ddd;
    border-radius: 2px;
  }

  .dele-image {
    height: 20px;
    margin: 8px 0;
    color: #fff;
    background: #e74c3c;
    border-radius: 2px;
  }

  .tip-span {
    position: relative;
    top: 11px;
    font-size: 13px;
    line-height: 250%;
    color: gray;
  }
</style>
