// @flow
import { createElement, isValidElement } from 'react';
import type { ComponentType, Element } from 'react';
import type { RenderFieldProps } from '../../utils/Field.types.js.flow';

type Props = {
    ...$Exact<RenderFieldProps>,
    component: ComponentType<any>,
    children?: Function | Element<any>,
};

const renderField = (props: Props) => {
    const {
        component,
        children,
        input,
        ...other
    } = props;

    const passProps = { ...input, ...other };

    return (
        component ? (
            createElement(component, passProps)
        ) : typeof children === 'function' ? (
            children(passProps)
        ) : isValidElement(children) ? (
            children
        ) : (
            null
        )
    );
};

export default renderField;
