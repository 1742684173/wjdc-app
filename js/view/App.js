import { SwitchNavigator, DrawerNavigator } from 'react-navigation';
import StackNavigator from '../common/StackNavigator';
import Main from './Main';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import FindPwd from './auth/FindPwd';
import AuthLoading from './auth';
import Publish from './publish';
import DrawerSideBar from './DrawerSideBar';
import BillInfo from './work/bill';
import Bills from './work/bill/Bills';
import BillForm from './work/bill/BillForm';
import BillDetail from './work/bill/BillDetail';
import BillMethodForm from './work/bill/BillMethodForm';
import BillSortForm from './work/bill/BillSortForm';
import Contact from './work/contact';
import ContactDetail from './work/contact/ContactDetail'

const AppStack = StackNavigator({
  Main,
  BillInfo,
  Bills,
  BillForm,
  BillDetail,
  BillMethodForm,
  BillSortForm,
  Publish,
  Contact,
  ContactDetail,
},);


const AuthStack = StackNavigator(
  {
    SignIn,
    SignUp,
    FindPwd,
  },
);

export default SwitchNavigator(
  {
    AuthLoading,
    Auth: AuthStack,
    // App:AppStack
    App: DrawerNavigator({
      AppStack,
    }, {
      contentComponent: DrawerSideBar,
    }),
  },
);