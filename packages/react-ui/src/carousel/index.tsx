import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { Carousel as AntCarousel } from 'antd'
import { CarouselProps } from 'antd/es/carousel'

import './style/index.less'

export const Carousel = forwardRef(( props: CarouselProps, ref) => {
    const carousel = useRef<AntCarousel | null>(null)
    useImperativeHandle(ref!, () => carousel.current!)
    return <AntCarousel ref={carousel} {...props}/>
})