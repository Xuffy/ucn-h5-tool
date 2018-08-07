<template>
  <div class="auth">
    <el-input
      type="textarea"
      :rows="10"
      placeholder="请复制Excel到这里"
      v-model="excelContent">
    </el-input>
    <div style="display: flex;justify-content: space-between;margin: 10px 0">
      <el-button type="primary" @click="ctyperow">生成权限树</el-button>
      <el-button type="success" @click="doneExcel">生成Excel</el-button>
    </div>

    <el-tree
      :data="treeData"
      node-key="code"
      ref="tree"
      :default-expanded-keys="defaultExpanded"
      :expand-on-click-node="false">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <div class="label">
          <el-input v-model="data.name_zh" placeholder="请输入中文名称"></el-input>
        </div>
        <div class="label">
          <el-input v-model="data.name_en" placeholder="请输入英文名称"></el-input>
        </div>
        <div @click="appendTree(data)">
          <i class="el-icon-circle-plus" style="display: inline-block;font-size: 18px;vertical-align: middle"></i>
          <span style="display: inline-block;vertical-align: middle">添加</span>
        </div>
        <div @click="removeTree(node, data)" v-if="!data.name_zh || !data.name_en">
          <i class="el-icon-remove" style="display: inline-block;font-size: 18px;vertical-align: middle"></i>
          <span style="display: inline-block;vertical-align: middle">删除</span>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
  import {saveAs} from 'file-saver/FileSaver';

  export default {
    name: 'dictionary',
    components: {},
    data() {
      return {
        excelContent: '',
        treeData: [],
        defaultExpanded: [],
        excelData: []
      }
    },
    created() {
      this.treeData = this.$sessionStore.get('tree-data');
    },
    mounted() {

    },
    computed: {},
    methods: {
      doneExcel() {
        this.excelData = [];
        this.recursionBuildJson(this.treeData);
        this.excelData = _.map(this.excelData, val => {
          let {code, name_en, name_zh, parent_code, partner_type, type} = val;
          if (!code) {
            let ne = name_en.trim().replace(new RegExp(' ', 'g'), '_');
            code = `${parent_code}:${ne}`.toLocaleUpperCase();
          }
          return {
            'code|*': code,
            'nameEn': name_en,
            'nameZh': name_zh,
            'parentCode': parent_code,
            'partnerType|*': partner_type,
            'type|*': type
          };
        });
        this.jsonToExcel(this.excelData);
      },
      removeTree(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.code === data.code);
        children.splice(index, 1);
      },
      appendTree(data) {
        console.log(data)
        let child = this.$depthClone(data);
        this.defaultExpanded = [data.code]
        data.children = data.children || [];
        child.name_zh = ''
        child.name_en = ''
        child.children = [];
        child.parent_code = child.code;
        child.code = '';
        child.type = Number(child.type) + 1;
        data.children = [child].concat(data.children);
      },
      dataFilter(data) {
        let tree = [];
        this.treeData = this.recursionBuildTree(data);
        this.$sessionStore.set('tree-data', this.treeData)
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
            var obj = data[i];
            if (data[i].type === '1' || data[i].type === '2' || data[i].type === '3' || data[i].type === '4') {
              temp = this.recursionBuildTree(data, data[i].code);
            }
            if (temp.length > 0) {
              obj.children = temp;
            }
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
        var content = html;
        var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
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

  .custom-tree-node .label {
    display: inline-block;
    min-width: 200px;
  }

  .custom-tree-node > div {
    margin-right: 10px;
  }

  .custom-tree-node i {
    color: #409eff;
  }

  .custom-tree-node i.el-icon-remove {
    color: red;
  }

  .auth /deep/ .el-tree-node__content {
    height: 45px;
    line-height: 45px;
  }

  .auth /deep/ .el-input__inner {
    border: none;
  }
</style>
