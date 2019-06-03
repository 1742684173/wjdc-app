// @flow
import { Animated , View, Button,Platform,Dimensions} from 'react-native';
import merge from 'lodash/merge';
import { StackNavigator as ReactStackNavigator } from 'react-navigation';
// eslint-disable-next-line max-len
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import type {
    NavigationRouteConfigMap,
    StackNavigatorConfig,
    NavigationContainer,
} from 'react-navigation';

const IOSTransitionSpec = {
    timing: Animated.spring,
    stiffness: 1000,
    damping: 500,
    mass: 3,
};

function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    );
}

function ifIphoneX(iphoneXStyle, regularStyle) {
    if (isIphoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
}

const SlideFromRightIOS = {
    transitionSpec: IOSTransitionSpec,
    screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    containerStyle: {
        backgroundColor: '#000',
        borderBottomWidth:0
    },
};

const defaultStackConfig = {
    headerMode: 'float',
    headerTransitionPreset: 'uikit',
    navigationOptions: {
        gesturesEnabled: false,
        headerTintColor: '#21c3ff',
        headerTitleStyle: {
            flexDirection: 'row',
            alignItems:'center',
            justifyContent:'center',
            color: '#333',
            fontSize: 24,
        },
        headerStyle: {
            //android 往下移动
            //paddingTop:15,
            elevation:0,
            backgroundColor: '#fff',
            borderBottomWidth: 0,
            /*  ...Platform.select({
                  ios:ifIphoneX({height: 88}, {}),
                  android:{paddingTop:20}
              })*/
        },
    },
    transitionConfig: () => SlideFromRightIOS,
};

const StackNavigator = (
    routeConfigMap: NavigationRouteConfigMap,
    stackConfig?: StackNavigatorConfig,
): NavigationContainer<*, *, *> => {
    return ReactStackNavigator(
        routeConfigMap,
        merge({}, defaultStackConfig, stackConfig),
    );
};

export default StackNavigator;
