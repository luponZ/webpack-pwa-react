import * as React from 'react';
import { ThemeContext } from './theme-context';

export interface themeButtonProps {};
export interface themeButtonState {};

export class themeButton extends React.Component<themeButtonProps, themeButtonState> {
    render() {
        return (
            <ThemeContext.Consumer>
                {theme => {
                    return <button {...this.props} style={{ backgroundColor: theme.background }}></button>
                }}
            </ThemeContext.Consumer>
        )
    }
}