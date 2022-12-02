import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-layout'
import { MenuDataItem } from '@ant-design/pro-components'
import styles from './index.module.less'
import './index.less'

const Index: React.FC = () => {
  const location = useLocation()
  function menuDataRender(menuData: MenuDataItem[]) {
    return [
      {
        name: '分组首页',
        children: [
          { name: '首页首页1', path: '/index' },
          { name: '首页首页2', path: '/index2' },
        ],
      },
      {
        name: '分组2',
        children: [{ name: '啦啦啦', path: '/test' }],
      },
    ]
  }
  return (
    <>
      <ProLayout
        layout="side"
        location={{ pathname: location.pathname }}
        menuDataRender={menuDataRender}
        menuItemRender={(menuDataItem, defaultDom) => {
          return <Link to={menuDataItem.path!}>{defaultDom}</Link>
        }}
        // 账号
        actionsRender={(props) => {
          return [<div className={styles.account_box}>管理员账号</div>]
        }}
      >
        <Outlet />
      </ProLayout>
    </>
  )
}
export default Index
