<template>
  <div class="wrap">
    <a-image
      v-if="isAssetTypeAnImage(src)"
      class="image"
      :src="imgUrlPrefix + src"
      style="width: auto; height: 70px"
    />
    <a v-if="!isAssetTypeAnImage(src)" :href="imgUrlPrefix + src"
      ><i class="fa fa-file file-font" aria-hidden="true"></i
    ></a>
  </div>
</template>
<script lang="ts">
  import { Image } from 'ant-design-vue';
  import { defineComponent, toRefs } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';

  const props = {
    src: { type: String, default: '' },
  };

  export default defineComponent({
    components: { aImage: Image },
    props,
    setup(props) {
      const { imgUrlPrefix } = useGlobSetting();

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
        isAssetTypeAnImage,
        imgUrlPrefix,
        ...toRefs(props),
      };
    },
  });
</script>
<style scoped>
  .wrap {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 80px;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  .file-font {
    font-size: 60px;
  }
</style>
