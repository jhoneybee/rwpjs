import React from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';

export const DatePicker = (props: DatePickerProps) => (
    <AntDatePicker {...props} />
)
DatePicker.MonthPicker = AntDatePicker.MonthPicker
DatePicker.RangePicker = AntDatePicker.RangePicker
DatePicker.TimePicker = AntDatePicker.TimePicker
DatePicker.WeekPicker = AntDatePicker.WeekPicker
DatePicker.YearPicker = AntDatePicker.YearPicker
