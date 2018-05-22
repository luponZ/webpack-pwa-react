import * as React from 'react';

export interface BoilingVerdictProps {
    celsius: number
}

export interface BoilingVerdicState {

}

export class BoilingVerdict extends React.Component<BoilingVerdictProps, BoilingVerdicState> {
    render() {
        if (this.props.celsius > 100) {
            return (
                <p>水会烧开</p>
            )
        } else {
            return (
                <p>水不会烧开</p>
            )
        }
    }
}