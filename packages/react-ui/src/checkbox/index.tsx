import React from 'react'
import { Checkbox as AntCheckbox } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';

export const Checkbox = (props: CheckboxProps) => <AntCheckbox {...props}/>
Checkbox.Group = AntCheckbox.Group
