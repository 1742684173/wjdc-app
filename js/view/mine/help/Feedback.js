import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import {connect} from 'react-redux';
import * as appJson from '../../../../app';
import * as actions from '../../../actions';
import BaseComponent from '../../base/BaseComponent'
import Button from "../../common/Button";
import {pxTodpHeight, pxTodpWidth} from "../../../utils/ScreenUtil";
import Field from "../../common/Field";
import TextArea from "../../common/TextArea";
import {formValueSelector, reduxForm} from 'redux-form';


class Feedback extends BaseComponent {

    state = {

    }

    // 构造
    constructor(props){
        super(props);
        this.setTitle('反馈');
    }

    _onSubmit = async (obj) => {

    }

    render() {
        super.render();
        let view = (
            <View style={{flex:1,paddingHorizontal: pxTodpWidth(30),backgroundColor:'#fff'}}>

                <View style={{height:pxTodpHeight(30)}}/>

                <Field name={'descs'} component={TextArea}
                       title={'描述'} isNeed={false} height={200}
                />

                <View style={{height:pxTodpHeight(100)}}/>
                <Button
                    style={{height:pxTodpHeight(78),backgroundColor:'#21c3ff',}}
                    onPress={this.props.handleSubmit(this._onSubmit)}
                >
                    <Text style={styles.btnSubmit}>提交</Text>
                </Button>
            </View>
        )

        return super.renderBase(view);
    }


}


const styles = StyleSheet.create({

});

const ReduxFeedbackForm = reduxForm({
    form: 'FeedbackForm',
})(Feedback)

export default connect(null,actions)(ReduxFeedbackForm);
