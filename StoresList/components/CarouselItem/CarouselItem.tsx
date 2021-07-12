import React, { PureComponent } from 'react';
import { Animated, Platform, View } from 'react-native';

import { Card, Shadow } from 'src/components/Base';
import { ThemeContext } from 'src/components/Theme';
import { IThemeContext } from 'src/components/Theme/ThemeContext';
import config from 'src/constants/config';
import { colors, themes } from 'src/styles';
import { darkColor, lightColor } from 'src/styles/_themes';
import styles from './CarouselItem.styles';
interface IProps {
  round: boolean;
  border: boolean;
  dark: darkColor;
}
export class CarouselItem extends PureComponent<IProps> {
  static contextType =  ThemeContext;
  static defaultProps = {
    border: false,
    dark: 'navy',
    round: false,
  };
  render () {
    const { children, border, dark } = this.props;
    const { theme, mode }: IThemeContext = this.context;
    return (
        <Card
          style={[
            styles.container ,
            mode === config.themeModeType.DARK && {  alignItems: 'flex-start', width: 130 },
            border && styles.borderStyle,
          ]}
          dark={dark}
        >
          {children}
        </Card>
    );

  }
}

export default CarouselItem;
