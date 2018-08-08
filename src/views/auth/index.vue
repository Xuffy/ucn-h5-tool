<template>
  <div class="auth">
    <!--<el-upload
      :action="$apis.IMPORTFILE_IMPORTTASKE"
      :before-upload="uploadBefore"
      :data="{templateCode:'BIZ_RESOURCE_IMPORT'}"
      name="importFile">
      <el-button size="small" type="primary">导入到数据库</el-button>
    </el-upload>-->
    <br>
    <el-input
      type="textarea"
      :rows="10"
      placeholder="请复制Excel到这里"
      v-model="excelContent">
    </el-input>
    <div style="display: flex;justify-content: space-between;margin: 10px 0;align-items: center">
      <el-button type="primary" @click="ctyperow">生成权限树</el-button>
      <el-button type="success" @click="doneExcel">生成Excel</el-button>
    </div>

    <el-tree
      :data="treeData"
      node-key="id"
      ref="tree"
      :default-expanded-keys="defaultExpanded"
      :expand-on-click-node="false">
      <div class="custom-tree-node" slot-scope="{ node, data }" :class="{isDelete:data.is_delete}">
        <div class="label">
          <el-input v-model="data.name_zh" :disabled="data.is_delete" placeholder="请输入中文名称"
                    @change="changeName(data)"></el-input>
        </div>
        <div class="label">
          <el-input v-model="data.name_en" :disabled="data.is_delete" placeholder="请输入英文名称"
                    @change="changeName(data)"></el-input>
        </div>
        <div @click="appendTree(data)" v-if="data.code" class="icon add">
          <i class="el-icon-circle-plus" style="display: inline-block;font-size: 18px;vertical-align: middle"></i>
          <span style="display: inline-block;vertical-align: middle">添加</span>
        </div>
        <div @click="deleteTree(data)" v-if="data.code" class="icon delete">
          <i class="el-icon-delete" style="display: inline-block;font-size: 18px;vertical-align: middle"></i>
          <span style="display: inline-block;vertical-align: middle">
          {{data.is_delete ? '撤回移除':'移除'}}
          </span>
        </div>
        <div @click="removeTree(node, data)" v-if="!data.name_zh || !data.name_en" class="icon remove">
          <i class="el-icon-remove" style="display: inline-block;font-size: 18px;vertical-align: middle"></i>
          <span style="display: inline-block;vertical-align: middle">删除</span>
        </div>
      </div>
    </el-tree>


    <el-dialog title="需要登录" :visible.sync="loginDialog">
      <el-form :model="login">
        <el-form-item label="用户名">
          <el-input v-model="login.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="login.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitLogin">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {saveAs} from 'file-saver/FileSaver';

  export default {
    name: 'dictionary',
    components: {},
    data() {
      return {
        loginDialog: false,
        excelContent: '',
        treeData: [],
        defaultExpanded: [],
        excelData: [],
        login: {
          email: '', partnerType: '1', password: ''
        }
      }
    },
    created() {
      this.treeData = this.$localStore.get('tree-data');
    },
    mounted() {
    },
    computed: {},
    methods: {
      doneExcel() {
        this.excelData = [];
        this.recursionBuildJson(this.treeData);
        this.excelData = _.map(this.excelData, val => {
          if (!val.code) {
            let ne = val.name_en.trim().replace(new RegExp(' ', 'g'), '_');
            val.code = `${val.parent_code}:${ne}`.toLocaleUpperCase();
          }
          return {
            'code|*': val.code,
            'nameEn': val.name_en,
            'nameZh': val.name_zh,
            'parentCode': val.parent_code,
            'partnerType|*': val.partner_type,
            'type|*': val.type,
            is_delete: val.is_delete,
            modify_remark: val.modify_remark
          };
        });
        this.jsonToExcel(this.excelData);
      },
      deleteTree(data) {
        this.$set(data, 'is_delete', !data.is_delete);
      },
      submitLogin() {
        this.$ajax.post(this.$apis.AUTHENTICATION_SIGNIN, this.login).then(res => {
          console.log(res)
        });
      },
      uploadBefore(file) {
        this.loginDialog = true;
        return false;
      },
      changeName(data) {
        data.modify_remark = this.$dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
      },
      removeTree(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.code === data.code);
        children.splice(index, 1);
      },
      appendTree(data) {
        let child = this.$depthClone(data);
        this.defaultExpanded = [data.id]
        child.name_zh = ''
        child.name_en = ''
        child.children = [];
        child.parent_code = child.code;
        child.code = '';
        child.type = Number(child.type) + 1;
        this.$set(data, 'children', [child].concat(data.children || []));
      },
      dataFilter(data) {
        let tree = [];
        this.treeData = this.recursionBuildTree(data);
        this.$localStore.set('tree-data', this.treeData)
      },
      recursionBuildJson(data) {
        _.map(data, val => {
          let child = this.$depthClone(val);
          if (!child.name_en || !child.name_zh) {
            return false;
          }
          delete child.children;
          this.excelData.push(child);
          !_.isEmpty(val.children) && this.recursionBuildJson(val.children);
        });
      },
      recursionBuildTree(data, pcode) {
        var result = [], temp;
        for (var i = 0; i < data.length; i++) {
          if (data[i].code && data[i].parent_code == pcode) {
            var obj = {code, name_en, name_zh, parent_code, partner_type, type, is_delete, modify_remark} = data[i];
            if (data[i].type === '1' || data[i].type === '2' || data[i].type === '3' || data[i].type === '4') {
              temp = this.recursionBuildTree(data, data[i].code);
            }
            if (temp.length > 0) {
              obj.children = temp;
            }
            obj.id = this.$getUUID();
            result.push(obj);
          }
        }
        return result;

      },
      ctyperow() {
        let fgf = /\t/
          , ctype = 0
          , txt = this.excelContent
          , datas = txt.split("\n")
          , html = "[\n"
          , keys = [];
        for (var i = 0; i < datas.length; i++) {
          var ds = datas[i].split(fgf);
          if (i == 0) {

            if (ctype == "0") {
              keys = ds;
            } else {
              html += "[";
              for (var j = 0; j < ds.length; j++) {
                html += '"' + ds[j] + '"';
                if (j < ds.length - 1) {
                  html += ",";
                }
              }
              html += "],\n";
            }
          } else {
            if (ds.length == 0) continue;
            if (ds.length == 1) {
              ds[0] == "";
              continue;
            }
            html += ctype == "0" ? "{" : "[";
            for (var j = 0; j < ds.length; j++) {
              var d = ds[j];
              if (d == "") continue;
              if (ctype == "0") {
                html += '"' + keys[j] + '":"' + d + '"';
              } else {
                html += '"' + d + '"';
              }
              if (j < ds.length - 1) {
                html += ',';
              }
            }
            html += ctype == "0" ? "}" : "]";
            if (i < datas.length - 1)
              html += ",\n";
          }


        }
        html += "\n]";
        this.dataFilter(eval('(' + html + ')'));
        // $("#result").val(html);
      },
      jsonToExcel(jsons) {
        let fgf = ',';
        if (jsons.length < 1) {
          return console.log('数组小于一行数据');
        }
        var titles = new Array();
        for (var key in jsons[0]) {
          titles.push(key);
        }

        var values = new Array();
        for (var i = 0, l = jsons.length; i < l; i++) {
          var value = new Array();
          for (var key in jsons[i]) {

            value.push(jsons[i][key]);
          }
          values.push(value);
        }

        var html = '';
        html += titles.join(fgf) + '\n'
        for (var i = 0; i < values.length; i++) {
          html += values[i].join(fgf) + '\n';
        }
        var blob = new Blob([html], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, `功能权限树 ${this.$dateFormat(new Date(), 'yyyy-mm-dd HH:MM')}.csv`);
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .custom-tree-node {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .custom-tree-node.isDelete {
    background-color: #dedede;
  }

  .custom-tree-node .label {
    display: inline-block;
    min-width: 200px;
  }

  .custom-tree-node > div {
    margin-right: 10px;
  }

  .custom-tree-node .icon {
    color: #409eff;
  }

  .custom-tree-node .icon.remove,
  .custom-tree-node .icon.delete {
    color: #f56c6c;
  }

  .auth /deep/ .el-tree-node__content {
    height: 45px;
    line-height: 45px;
  }

  .auth .custom-tree-node /deep/ .el-input__inner {
    border: none;
  }
</style>
