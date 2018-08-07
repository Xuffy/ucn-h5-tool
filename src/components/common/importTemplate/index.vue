<template>
  <div class="ucn-import">
    <el-dialog
      class="ucn-import-dialog"
      :close-on-click-modal="false"
      :title="$i.importTemplate.import"
      :visible.sync="dialogVisible"
      width="50%">

      <el-form label-width="80px">

        <el-form-item :label="$i.importTemplate.note" class="remark-box important">
          <h5>{{$i.importTemplate.importPrompt}}</h5>
        </el-form-item>

        <el-form-item :label="$i.importTemplate.upload">
          <el-upload
            :action="$apis.IMPORTFILE_IMPORTTASKE"
            :headers="{'U-Session-Token':$localStore.get('token')}"
            :on-preview="()=>$router.push({path:'/logs/task'})"
            :limit="10"
            :data="{templateCode:code,bizCode:bizCode}"
            name="importFile"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <el-button type="primary">{{this.tips || $i.importTemplate.selectFile}}
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$i.importTemplate.remark" class="remark-box">
          <h5>1.{{$i.importTemplate.remark1}}
            <a :href="downTemplate" v-if="downTemplate" target="_blank" v-text="$i.importTemplate.template"></a></h5>
          <h5>2.{{$i.importTemplate.remark2}}</h5>
          <h5>3.{{$i.importTemplate.remark3}}</h5>
          <router-link to="/logs/task">
            <el-button type="text">{{$i.logs.lookImportTitle}}</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 导入组件
   * 用例：
   * $refs.importFile.show()
   *
   * <v-import-template ref="importFile" code="PRODUCT_SUPPLIER" biz-code="PRODUCT_SUPPLIER"></v-import-template>
   */

  export default {
    name: 'VImport',
    components: {},
    //传送的数据
    props: {
      code: {
        type: String,
        default: '',
      },
      tips: {
        type: String,
        default: '',
      },
      bizCode: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        dialogVisible: false,
        fileList: [],
        downTemplate: '',
      }
    },
    watch: {},
    created() {
    },
    mounted() {
      // this.getTemplate();
    },
    methods: {
      show() {
        this.dialogVisible = true;
        this.getTemplate();
      },
      beforeAvatarUpload(file) {
        if (file.name.indexOf('.zip') < 0 && file.name.indexOf('.xls') < 0) {
          this.$message.warning(this.$i.importTemplate.fileTypePrompt);
          return false;
        }
      },
      getTemplate() {
        this.$ajax.post(this.$apis.IMPORTTEMPLATE_DOWNLOADURL, [this.code], {cache: true})
          .then(res => {
            this.downTemplate = res[0] ? res[0].fileUrl : '';
          });
      },
      handleExceed(files, fileList) {
        this.$message.warning(this.$i.importTemplate.fileNumberPrompt);
      },
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .remark-box h5 {
    font-weight: 100;
  }

  .remark-box h5 a {
    color: #3a8ee6;
    text-decoration: underline;
  }

  .remark-box.important /deep/ .el-form-item__label,
  .remark-box.important {
    color: red;
    margin-bottom: 5px;
  }
</style>
<style>
</style>
