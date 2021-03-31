import React, { ComponentType, useState, useRef, useEffect, CSSProperties, ReactNode } from 'react'
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { generate } from 'shortid'
import classnames from 'classnames'
import { Modal, Spin, Carousel } from '../index'
import { ModalHandle } from '../modal/index'
import { classPrefix } from '../utils'

import './style/index.less'

const classNameUpload = `${classPrefix}-upload`

interface UploadHandle {
    showOpenDialog: () => void
}

interface UploadRender {
    // 组件改变的时候触发的事件
    files: FileList | undefined
    upload: UploadHandle
}

interface UploadProps {

    // 渲染upload的拦截方式
    uploadRender: ComponentType<UploadRender>

    // 组件改变的时候触发的事件
    onChange?: (files: FileList | undefined) => void
    /**
     * 是否支持多选
     */
    multiple?: boolean
    /**
     * 接收文件类型
     */
    accept?: string
    style?: CSSProperties
}



/**
 * 上传组件
 */
export const Upload = ({
    onChange,
    uploadRender: UploadRender,
    multiple,
    accept,
    style,
}: UploadProps) => {
    const [files, setFiles] = useState<FileList | undefined>(undefined)
    const [key, setKey] = useState<string>(generate());
    const uploadRef = useRef<HTMLInputElement>(null)
    const upload = {
        showOpenDialog: () => {
            uploadRef.current?.click()
        }
    }

    return (
        <div
            className={`${classNameUpload}-wrapper`}
            style={style}
        >
            <UploadRender
                files={files}
                upload={upload}
            />
            <input
                ref={uploadRef}
                key={key}
                className={`${classNameUpload}-input-file`}
                multiple={multiple}
                accept={accept}
                type="file"
                onChange={event => {
                    const { files: targeFiles } = event.target
                    setFiles(targeFiles as FileList | undefined)
                    onChange?.(targeFiles as FileList | undefined)
                    setKey(generate())
                }}
            />
        </div>
    )
}

export interface UploadImageType {
    id: string
    url: string
    name: string
    state?: 'SUCCESS' | 'FAIL'
}

interface UploadPicturesWallProps {
    // 图片改变的时候触发的事件
    onChange?: (images: UploadImageType[]) => void
    // 要展现的图片
    images?: UploadImageType[]
    // 图片上传的事件
    onUpload?: (file: FileList) => Promise<UploadImageType[]>
    // 渲染图标的render
    actionRender?: ComponentType<{className: string, children: ReactNode}>
    // 样式
    style?: CSSProperties
    // 是否多选
    multiple?: boolean
    // 设置可以上传的后缀
    accept?: string
}

/**
 * 照片墙上传
 */
export const UploadPicturesWall = ({
    onChange,
    onUpload,
    images: imagesProp = [],
    actionRender: ActionRender = ({className, children}) => (
        <div className={className}>{children}</div>
    ),
    style,
    multiple,
    accept
}: UploadPicturesWallProps) => {
    const uploadRender = ({
        files,
        upload,
    }: UploadRender) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [images, setImages] = useState<UploadImageType[]>(imagesProp)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selectKeys, setSelectKey] = useState<string[]>([])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const modal = useRef<ModalHandle | null>(null)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [spinning, setSpinning] = useState<boolean>(false)

        const getImgsAsync = (imgFiles: FileList) => {
            setSpinning(true)
            onUpload?.(imgFiles).then(resp => {
                const tempImages = images.concat(resp)
                onChange?.(tempImages)
                setImages(tempImages)
                setSpinning(false)
            })
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if(files){
                getImgsAsync(files)
            }
        }, [files])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const carousel = useRef<any | null>(null)
        return (
            <>
                {images.map(ele => (
                    <div
                        key={ele.id}
                        className={classnames({
                            [`${classNameUpload}-list-item`]: true,
                            [`${classNameUpload}-list-select-item`]: selectKeys.includes(ele.id)
                        })}
                        onClick={() => {
                            const index = selectKeys.findIndex(key => ele.id === key)
                            if(index !== -1){
                                selectKeys.splice(index, 1)
                            }else{
                                selectKeys.push(ele.id)
                            }
                            setSelectKey([...selectKeys])
                        }}
                    >
                        <img src={ele.url} alt={ele.name} />
                        <ActionRender className={`${classNameUpload}-list-item-info`}>
                            <EyeOutlined
                                className="upload-action-icon"
                                key='eye'
                                onClick={e => {
                                    const index = images.findIndex(img => ele.id === img.id)
                                    carousel.current?.goTo(index)
                                    modal.current?.show()
                                    e.stopPropagation()
                                }}
                            />
                            <DeleteOutlined
                                className="upload-action-icon"
                                key='delete'
                                onClick={e => {
                                    const index = images.findIndex(img => ele.id === img.id)
                                    images.splice(index, 1)
                                    setImages([...images])
                                    e.stopPropagation()
                                }}
                            />
                        </ActionRender>
                    </div>
                ))}
                <Spin
                    spinning={spinning}
                >
                    <div
                        className={`${classNameUpload}-select-picture-card`}
                        onClick={() => {
                            upload.showOpenDialog()
                        }}
                    >
                        {spinning ? undefined : <PlusOutlined />}
                    </div>
                </Spin>
                <Modal
                    modal={modal}
                    footer={false}
                    width={900}
                    forceRender
                    title="图片预览"
                >
                    <div
                        style={{
                            margin: 20
                        }}
                    >
                        <Carousel
                            arrows
                            ref={carousel}
                        >
                            {images.map(ele => (
                                <div
                                    key={generate()}
                                >
                                    <img
                                        src={ele.url}
                                        style={{ width: '100%', height: 400 }}
                                        alt={ele.name}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </Modal>
            </>
        )
    }
    return (
        <Upload
            style={style}
            multiple={multiple}
            accept={accept}
            uploadRender={uploadRender}
        />
    )
}
