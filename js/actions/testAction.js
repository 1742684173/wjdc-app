import appJson from '../../app';

export const getAges = (age) => {
    console.log(age,'age') // 3
    return {
        type: appJson.action.test,
        payload: age
    }
}