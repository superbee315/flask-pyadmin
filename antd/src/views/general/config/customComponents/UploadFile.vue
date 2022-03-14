<template>
  <div>
    <div style="display: flex">
      <Input class="upload-input" :value="fileUrls" disabled />
      <BasicUpload
        :maxSize="20"
        :maxNumber="fileNum"
        @change="handleChange"
        :api="uploadApi"
        class="my-3"
        :accept="['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'xls', 'xlsx']"
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

    <div class="file-list" v-if="file_list.length">
      <div v-for="(item, index) in file_list" :key="index">
        <div class="file-item" v-if="item !== ''">
          <div class="file-wrap">
            <a-image v-if="isAssetTypeAnImage(item)" width="70px" :src="imgUrlPrefix + item" />
            <a
              v-if="!isAssetTypeAnImage(item)"
              :href="imgUrlPrefix + item"
              :download="getFilename(item)"
              ><i class="fa fa-file file-font" aria-hidden="true"></i
            ></a>
          </div>
          <div class="dele-file" @click="deleteFile(item, index)">
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
      // const { createMessage } = useMessage();
      const fileNum = ref(1);
      if (props.type === 'files') {
        fileNum.value = 10;
      }
      const { imgUrlPrefix } = useGlobSetting();
      const [chooseModalRegister, { openModal }] = useModal();
      function openChooseModal() {
        openModal(true);
      }
      const state = reactive({
        fileUrls: props.value,
        file_list: [] as string[],
        tipShow: false,
      });
      state.file_list = props.value.split(',');
      function deleteFile(url, index) {
        console.log(`url`, url);
        const arr = state.fileUrls.split(',');
        arr.splice(index, 1);
        state.fileUrls = arr.toString();
        emit('change', state.fileUrls);
      }
      function checked(files) {
        if (props.type === 'file') {
          state.fileUrls = files[0].url;
        } else {
          let urls: string[] = [];
          files.map((item) => {
            urls.push(item.url);
          });
          state.fileUrls += ',' + urls.toString();
        }
        emit('change', state.fileUrls);
      }

      watch(props, (props: PropsType) => {
        state.file_list = props.value.split(',');
      });
      function getFilename(filePath) {
        //获取最后一个\的位置
        const index = filePath.lastIndexOf('\\');
        //获取后缀
        const filename = filePath.substr(index + 1);
        return filename;
      }

      function isAssetTypeAnImage(filePath) {
        //获取最后一个.的位置
        const index = filePath.lastIndexOf('.');
        //获取后缀
        const ext = filePath.substr(index + 1);
        return (
          ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(
            ext.toLowerCase()
          ) !== -1
        );
      }
      return {
        handleChange: (list: string[]) => {
          if (props.type === 'file') {
            state.fileUrls = list[0];
          } else {
            state.fileUrls = list.toString();
          }
          emit('change', state.fileUrls);
        },
        checked,
        fileNum,
        imgUrlPrefix,
        getFilename,
        isAssetTypeAnImage,
        openChooseModal,
        deleteFile,
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

  .file-list {
    display: flex;
    flex-wrap: wrap;
    width: 70%;
  }

  .file-item {
    width: 120px;
    margin: 0 5px;
    text-align: center;
  }

  .file-wrap {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 80px;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  .file-font {
    font-size: 60px;
  }

  .dele-file {
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
