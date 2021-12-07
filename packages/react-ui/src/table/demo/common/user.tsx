import React from 'react'
import { Input } from 'antd'

type User = {
    // 当前页码
    pageNo: string
    // 身份证
    idCard: string
    // 用户名称
    username: string
    // 用户密码
    password: string
    // 电话号码
    phone: string
    // 出生日期
    dateBirth: string
}

export const loadData = (pageNo: number , pageSize: number) => {
    console.log(pageNo, pageSize)
    return new Promise((resolve) => {
        const userDatas: User[] = []
        for (let i=0; i < pageSize; i += 1) {
            userDatas.push({
                pageNo: `当前加载第${pageNo}页`,
                idCard: `429*******${Math.ceil(Math.random() * 100)}`,
                username: 'Kotomi Ichinose',
                password: '********',
                phone: '+86 188*****12',
                dateBirth: `19${Math.ceil(Math.random() * 100)}`
            })
        }
        setTimeout(() => {
            resolve({
                datas: userDatas,
                total: 1000,
            })
        }, 1000)
    })
}

export const editColumns = [{
    name: '$index',
    title: '序号',
},{
    name: 'pageNo',
    editable: true,
    title: '当前页码'
},{
    name: 'idCard',
    editable: true,
    title: '身份证'
},{
    name: 'username',
    editable: true,
    title: '用户名称'
},{
    name: 'password',
    editable: true,
    title: '用户密码'
},{
    name: 'phone',
    editable: true,
    title: '电话号码'
},{
    name: 'dateBirth',
    editable: true,
    title: '出生日期'
}]

export const columns = [{
    name: '$index',
    title: '序号',
    headerRenderer: (props: any) => (
        <div>☘{props.column.name}</div>
    )
},{
    name: 'pageNo',
    title: '当前页码',
    editable: true,
},{
    name: 'idCard',
    title: '身份证',
    editable: true
},{
    name: 'username',
    title: '用户名称',
    editable: true
},{
    name: 'password',
    title: '用户密码',
    editable: true
},{
    name: 'phone',
    title: '电话号码',
    editable: true
},{
    name: 'dateBirth',
    title: '出生日期',
    editable: true
}]
