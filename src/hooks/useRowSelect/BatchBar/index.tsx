import { Toolbar, Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import { alpha } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './index.module.less'
import classNames from 'classnames'

export interface IBatchBarProps {
  numSelected?: number
  onDeleteAll?: () => void
  actions?: ReactNode
}

const Index: React.FC<IBatchBarProps> = (props) => {
  const { numSelected = 0, actions } = props
  return (
    <Toolbar
      className={classNames({
        [styles.toolbar]: true,
        [styles.selected]: numSelected > 0,
      })}
      sx={{
        // pl: { sm: 2 },
        // pr: { xs: 1, sm: 1 },
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
        {numSelected} 选择
      </Typography>
      <div className={styles.actions_wrap}>{actions}</div>
      <IconButton onClick={props.onDeleteAll}>
        <DeleteIcon />
      </IconButton>
    </Toolbar>
  )
}
export default Index
