import React from 'react'
import { Row as AntRow, Col as AntCol } from 'antd'
import { RowProps } from 'antd/lib/row'
import { ColProps } from 'antd/lib/col'

export const Row = (props: RowProps) => <AntRow {...props} />

export const Col = (props: ColProps) => <AntCol {...props} />
