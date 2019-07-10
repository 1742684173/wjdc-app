import appJson from '../../app';

export const getAges = (age) => {
    return {
        type: appJson.action.test,
        payload: age
    }
}