import React from 'react'
import { Radio as AntRadio } from 'antd';
import { RadioProps } from 'antd/lib/radio';

export const Radio = (props: RadioProps) => <AntRadio {...props}/>
Radio.Group = AntRadio.Group
