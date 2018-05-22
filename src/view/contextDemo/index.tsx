import * as React from 'react';
import { themes } from './theme-context';

export interface AppProps {};
export interface AppState {};

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            theme: themes.light
        }
    }

    public toggleTheme() {
        
    }
}