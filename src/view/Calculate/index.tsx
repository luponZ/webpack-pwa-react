import * as React from 'react';
import { BoilingVerdict } from './components/BoilingVerdict';


export interface CalculatorState {
    temperature: string
}

export interface CalculatorProps {
    
}


export class Calculator extends React.Component<CalculatorProps, CalculatorState> {
    public textInput: React.RefObject<HTMLInputElement>;
    public formRef: React.RefObject<HTMLFormElement>;

    constructor(props: CalculatorProps) {
        super(props);
        this.state  = {
            temperature: ''
        };
        this.textInput = React.createRef();
        this.formRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.foucTextInput = this.foucTextInput.bind(this);
    }

    public handleChange(e: any): void {
        this.setState({ temperature: e.target.value });
    }

    /**
     * foucTextInput
     */
    public foucTextInput() {
        (this.textInput.current as HTMLInputElement).focus()
    }

    public render(): JSX.Element {
        const temperature = this.state.temperature;
        return (
            <fieldset>
                <legend>输入一个摄氏温度</legend>
                <form action="" ref={this.formRef}></form>
                <input
                    value={this.state.temperature}
                    onChange={this.handleChange} 
                    ref={this.textInput}/>

                <BoilingVerdict
                    celsius={parseFloat(temperature)} />
                <input type="button" value="Focus the text input" onClick={this.foucTextInput}></input>
            </fieldset>
        )
    }

}