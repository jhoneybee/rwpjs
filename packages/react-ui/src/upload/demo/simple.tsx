/**
 * title: 图片墙
 * desc: 用来上传图片,已经展现一组图片。可通过 `multiple` 来设置多选, 通过 `accept` 来设置可以上传的文件格式
 */

import React, { useState, useEffect } from 'react'

// eslint-disable-next-line import/no-unresolved
import { UploadPicturesWall, UploadImageType } from '@rwp/react-ui'

export default () => {
    const [images, setImages] = useState<UploadImageType[]>([])
    
    useEffect(() => {
      setImages([{
        id: '1',
        url: 'https://user-images.githubusercontent.com/24241052/91524537-0b925f00-e932-11ea-8f8d-d037d9520059.jpg',
        name: '可爱的小姐姐'
      }])
    }, [])
    return (
        <UploadPicturesWall
            images={images}
            onChange={images => {
              console.log(images)
            }}
            onUpload={async (files: FileList) => {
                const promises: Promise<UploadImageType>[] = []
                for (let i = 0; i< files.length; i += 1) {
                    promises.push(new Promise<UploadImageType>((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(files.item(i)!)
                        reader.onload = () => {
                            const { result } = reader
                            const data: UploadImageType = {
                                id: `${new Date().getTime()}`,
                                name: `${new Date().getTime()}`,
                                url: result!.toString(),
                                state: 'SUCCESS'
                            }
                            resolve(data)
                        }
                    }))
                }
                const images = await Promise.all(promises)
                return images
            }}
        />
    )
}