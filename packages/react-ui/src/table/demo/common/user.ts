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

export const loadData = async (pageNo: number , pageSize: number) => {
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
    return {
        datas: userDatas,
        total: 150,
    }
}

export const columns = [{
    name: '$index',
    title: '序号',
},{
    name: 'pageNo',
    title: '当前页码'
},{
    name: 'idCard',
    title: '身份证'
},{
    name: 'username',
    title: '用户名称'
},{
    name: 'password',
    title: '用户密码'
},{
    name: 'phone',
    title: '电话号码'
},{
    name: 'dateBirth',
    title: '出生日期'
}]
