<template>
  <div class="filter-column">
    <el-popover
      v-model="visible"
      @after-leave="update()"
      placement="bottom-end"
      trigger="click">
      <i slot="reference" class="iconfont icon-shezhi"></i>
      <div v-loading="loading">
        <el-input v-model="filterText" :placeholder="$i.common.content" prefix-icon="el-icon-search"
                  size="mini" clearable style="margin-bottom: 10px"></el-input>
        <div style="height: 200px;overflow: auto">
          <el-tree
            show-checkbox
            default-expand-all
            node-key="property"
            :data="dataList"
            :props="{label: '_name'}"
            :indent="5"
            :filter-node-method="filterNode"
            ref="columnTree">
          </el-tree>
        </div>
        <br/>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-button size="mini" style="width: 100%" @click="submitFilter">{{$i.common.confirm}}</el-button>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" style="width: 100%" @click="cancel">{{$i.common.cancel}}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import $i from '../../../language/index';

  export default {
    name: 'VFilterColumn',
    props: {
      code: {
        type: String,
        default: '',
      },
      getConfig: {
        type: Function
      }
    },
    data() {
      return {
        loading: false,
        visible: false,
        dataList: [{_name: $i.table.checkAll, children: []}],
        checkAll: false,
        filterText: '',
        isIndeterminate: true,
        columns: []
      }
    },
    watch: {
      filterText(val) {
        this.$refs.columnTree.filter(val);
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      update(isUpdate = false, data = []) {

        if (!_.isEmpty(data)) {
          this.columns = _.values(data[0]);
        }

        return this.$ajax.get(this.$apis.GRIDFAVORITE_PARTWITHSETTING, {bizCode: this.code}, {cache: !isUpdate})
          .then(res => {
            let list = _.pluck(_.where(res, {isChecked: 1}), 'property')
              , dataList = [];

            this.columns = _.map(this.columns, val => {
              let item = _.findWhere(res, {property: val._filed || val.key})
              if (!val._hide && item) {
                item._name = val.label;
                dataList.push(item);
              }

              if (_.isObject(val) && _.isUndefined(val._sort)) {
                val._sort = !!item && item.sortable === 1;
              }
              return val;
            });

            this.init(dataList, list);

            return list;
          });
      },
      init(data, checkList) {
        this.dataList[0].children = data;

        this.$nextTick(() => this.$refs.columnTree.setCheckedKeys(checkList));
      },
      filterNode(value, data) {
        if (!value) return true;
        return data._name && data._name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
      getFilterData(data, checkList) {
        return _.map(data, val => {
          return _.mapObject(val, v => {
            if (_.isObject(v)) {
              v._hidden = checkList.indexOf(v._filed || v.key) === -1;
            }
            return v;
          });
        });
      },
      submitFilter() {
        let selected = this.$refs.columnTree.getCheckedNodes()
          , params = {bizCode: this.code, userGridFavoriteList: []};
        this.loading = true;

        _.map(selected, value => {
          let {id, seqNum} = value;
          id && params.userGridFavoriteList.push({seqNum, gridFieldId: id});
        });

        this.$ajax.post(this.$apis.GRIDFAVORITE_UPDATE, params)
          .then(res => {
            this.visible = false;
            this.update(true).then(data => this.$emit('change', data));
          })
          .finally(() => this.loading = false);
      },
      cancel() {
        this.visible = false;
        this.update();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .filter-column {
    margin-left: 10px;
    display: inline-block;
  }

  .filter-column .icon-shezhi {
    font-size: 20px;
    color: #666666;
    cursor: pointer;
  }

</style>
<style>
  .ucn-table .ivu-poptip-body {
    padding: 0;
  }
</style>
