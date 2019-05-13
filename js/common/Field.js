// @flow
import React from 'react';
import renderField from './renderField';
import type { FieldProps } from './Field.types.js.flow';
import { Field as ReduxField } from 'redux-form';

const Field = (props: FieldProps) => {
    const {
        props: custom,
        component,
        ...other
    } = props;

    return (
        <ReduxField
            {...other}
            component={renderField}
            props={{ component, ...custom }}
        />
    );
};

export default Field;
