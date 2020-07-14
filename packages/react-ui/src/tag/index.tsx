import React from 'react';
import { Tag as AntTag } from 'antd';
import { TagProps } from 'antd/lib/tag';

export const Tag = (props: TagProps) => <AntTag {...props} />

Tag.CheckableTag = AntTag.CheckableTag
