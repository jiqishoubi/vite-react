import _ from 'lodash'

/// 给class添加：state.selectedRows this.selectedRowKeys() this.rowSelectionProps() this.setSelectedRows()

export default function (self, rowKey) {
  self.state.selectedRows = []

  self.selectedRowKeys = () => {
    return self.state.selectedRows.map((item) => item[rowKey])
  }

  self.rowSelectionProps = () => {
    return {
      selectedRowKeys: self.selectedRowKeys(),
      onSelect: (row, isSelected, _) => {
        updateSelectedRows(isSelected, [row])
      },
      onSelectAll: (isSelected, _, changeRows) => {
        updateSelectedRows(isSelected, changeRows)
      },
    }
  }

  function updateSelectedRows(isSelected, list) {
    let arr = []
    if (isSelected) {
      arr = _.uniqBy([...self.state.selectedRows, ...list], rowKey)
    } else {
      arr = _.differenceBy(self.state.selectedRows, list, rowKey) // 从第一个数组删除第二个数组中的元素
    }
    self.setState({ selectedRows: arr })
  }

  self.setSelectedRows = (newRows) => {
    self.setState({
      selectedRows: newRows,
    })
  }
}
