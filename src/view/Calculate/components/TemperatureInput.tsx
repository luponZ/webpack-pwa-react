import * as React from 'react';

export interface TemperatureInputProps {
    scale: string;
    temperature: number;
    onTemperatureChange: () => void;
}

export interface TemperatureInputState {

}

export class TemperatureInput extends React.Component<TemperatureInputProps, TemperatureInputState> {

}