import type React from 'react';

export type ReactComponent<Props = any> = React.ComponentClass<Props, any> | React.FC<Props>;
export type ReactComponentOrElement<Props = any> = ReactComponent<Props> | JSX.Element;
