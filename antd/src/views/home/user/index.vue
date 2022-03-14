<template>
  <div class="wrap">
    <div class="title">个人资料</div>
    <div class="userinfo">
      <CropperAvatar
        id="pc-show"
        :uploadApi="uploadApi"
        :value="avatar"
        :showBtn="false"
        @change="handleChange"
      />
      <div id="phone-show">
        <a-upload :showUploadList="false" :multiple="false" :before-upload="beforeUpload">
          <div class="user-avatar">
            <img :src="avatar" alt="" onerror="this.src='../src/assets/images/default.png'" />
          </div>
        </a-upload>
      </div>
      <div class="username">{{ user.username }}</div>
      <div class="email">{{ user.email }}</div>
    </div>
    <div class="user-form">
      <div class="form-item">
        <div class="lable-item">用户名</div>
        <div class="input">
          <input disabled type="text" :value="username" />
        </div>
      </div>
      <div class="form-item">
        <div class="lable-item">Email<span class="red">*</span></div>
        <div class="input">
          <input type="text" v-model="email" />
        </div>
      </div>
      <div class="form-item">
        <div class="lable-item">昵称<span class="red">*</span></div>
        <div class="input">
          <input type="text" v-model="nickname" />
        </div>
      </div>
      <div class="form-item">
        <div class="lable-item">密码</div>
        <div class="input">
          <input type="password" placeholder="不修改密码请留空" v-model="password" />
        </div>
      </div>
      <div class="btn-warp">
        <a-button @click="submit({ nickname, email, password })" type="success">提交</a-button>
        <a-button @click="reset">重置</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMyInfo, editMyInfo } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
  import { useGlobSetting } from '/@/hooks/setting';
  import { Upload } from 'ant-design-vue';
  import { CropperAvatar } from '/@/components/Cropper';
  import { uploadApi } from '/@/api/sys/upload';

  export default defineComponent({
    name: 'User',
    components: { CropperAvatar, [Upload.name]: Upload },
    setup() {
      const userStore = useUserStore();
      const { imgUrlPrefix } = useGlobSetting();
      const { createMessage } = useMessage();
      const { success, error } = createMessage;
      const userinfo = reactive({
        username: '',
        nickname: '',
        email: '',
        avatar: '',
        password: '',
      });
      const user = reactive({
        username: '',
        nickname: '',
        email: '',
        avatar: '',
      });
      init(); // 初始化获取信息
      function init() {
        getMyInfo().then((res) => {
          const data = res.row;
          userinfo.username = data.username;
          userinfo.nickname = data.nickname;
          userinfo.email = data.email;
          userinfo.avatar = imgUrlPrefix + data.avatar;
          userinfo.password = '';
          user.nickname = data.nickname;
          user.username = data.username;
          user.email = data.email;
          user.avatar = imgUrlPrefix + data.avatar;
          userStore.setUserInfo(data);
        });
      }
      function beforeUpload(file) {
        uploadApi({ file })
          .then((res: any) => {
            editMyInfo({ avatar: res.data.result.url })
              .then(() => {
                success('修改成功！');
                init();
              })
              .catch((err) => {
                error(err);
              });
          })
          .catch((err) => {
            error('头像修改失败');
            console.log(`err`, err);
          });
        return false;
      }
      function handleChange(e) {
        editMyInfo({ avatar: e.data.result.url })
          .then(() => {
            success('修改成功！');
            init();
          })
          .catch((err) => {
            error(err);
          });
      }
      function reset() {
        userinfo.username = user.username;
        userinfo.nickname = user.nickname;
        userinfo.email = user.email;
        userinfo.password = '';
      }
      function submit(data) {
        const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (data.nickname === '') {
          error('昵称不能为空！');
          return;
        } else if (!pattern.test(data.email)) {
          error('邮箱格式错误！');
          return;
        }
        editMyInfo(data)
          .then(() => {
            success('修改成功！');
            init();
          })
          .catch((err) => {
            error(err);
          });
      }
      return {
        reset,
        uploadApi,
        handleChange,
        beforeUpload,
        submit,
        user,
        ...toRefs(userinfo),
      };
    },
  });
</script>
<style scoped>
  .wrap {
    margin: 20px;
  }

  .title {
    font-size: 20px;
  }

  .userinfo {
    width: 200px;
    margin: 0 auto;
    margin-top: 50px;
    text-align: center;
  }

  #pc-show {
    display: block;
  }

  #phone-show {
    display: none;
  }

  .user-avatar {
    width: 152px;
    height: 152px;
    padding: 4px;
    margin: 0 auto;
    border: 2px solid #d2d6de;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .user-avatar img {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    border-radius: 50%;
  }

  .username {
    padding-top: 2px;
    font-size: 25px;
  }

  .email {
    font-size: 18px;
    color: #abacac;
  }

  .red {
    color: red;
  }

  .user-form {
    width: 350px;
    margin: 10px auto;
  }

  .form-item {
    width: 100%;
    padding: 5px 0;
  }

  .lable-item {
    margin-bottom: 2px;
    font-size: 16px;
    font-weight: bold;
  }

  .form-item input {
    width: 100%;
    padding: 5px;
    border: 1px solid #abacac;
    border-radius: 2px;
    outline: none;
  }

  .btn-warp {
    margin: 15px 0;
  }

  .btn-warp button {
    margin: 0 2px;
  }
  @media (max-width: 430px) {
    #pc-show {
      display: none;
    }

    #phone-show {
      display: block;
    }
    .form-item input {
      width: 95%;
    }
  }
  @media (max-width: 360px) {
    .form-item input {
      width: 90%;
    }
  }
  @media (max-width: 320px) {
    .form-item input {
      width: 80%;
    }
  }
</style>
