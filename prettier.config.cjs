// vite3 设置了"type": "module" 后你的所有js文件默认使用ESM模块规范，不支持commonjs规范，所以必须显式的声明成xxx.cjs才能标识这个是用commonjs规范的，把你的配置都改成.cjs后缀

module.exports = {
  htmlWhitespaceSensitivity: 'ignore', // 解决vue闭合标签跑到下一行的问题
  semi: false, // 是否在每行末尾添加分号
  bracketSameLine: false, // 如果为 true，则将多行jsx元素的 > 放在最后一行的末尾，而不是单独放在下一行
  singleQuote: true, // 如果为 true，将使用单引号而不是双引号
  printWidth: 180, // 换行长度，默认80
}
