import * as React from 'react';
import { themes, ThemeContext } from './theme-context';
import { ThemeButton } from './theme-button';

export interface AppProps {};
export interface AppState {
    theme: {
        foreground: string,
        background: string,
    }
};

function Toolbar(props: {changeTheme: () => void}) {
    return (
        <ThemeButton onClick={props.changeTheme}>
            Change Theme
        </ThemeButton>
    );
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            theme: themes.light
        };
        this.toggleTheme = this.toggleTheme.bind(this);
    }

    public toggleTheme() {
        this.setState(preState => {
            return {
                theme: preState.theme === themes.dark ? themes.light : themes.dark
            }
        })
    }

    /**
     * render
     */
    public render() {
        return (
            <div>
                <ThemeContext.Provider value={this.state.theme}>
                    <Toolbar changeTheme={this.toggleTheme} />
                </ThemeContext.Provider>
            </div>
        )
    }
}