/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 * @flow
 */
"use strict";

import React from "react";
import ViewPager from "./ViewPager";
import {Dimensions, StyleSheet, View} from "react-native";
import {pxTodpHeight, pxTodpWidth, ScreenHeight, ScreenWidth} from "../../common/ScreenUtil";

type Props = {
    count: number,
    selectedIndex: number,
    onSelectedIndexChange?: (index: number) => void,
    renderCard: (index: number) => ReactElement<any>,
    style?: any
};

const WINDOW_WIDTH = Dimensions.get("window").width;

class Carousel extends React.Component {
    props: Props;

    static CardWidth = WINDOW_WIDTH;



    render() {
        let cards = [];
        const { renderCard,selectedIndexScreen } = this.props;

        React.Children.map(renderCard, (child, i) => {
            let content = null;
            // if (Math.abs(selectedIndex - i) === 0) {
            if (selectedIndexScreen - i >= 0) {
                content = (
                    <View key={i} style={{flex:1}}>
                        {child}
                    </View>
                )
            }
            cards.push(content);
        });

        return (
            <ViewPager {...this.props} bounces={true}>
                {cards}
            </ViewPager>
        );

    }
}

module.exports = Carousel;
