import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tasks from '../Tasks/Tasks';
import Auth from '../Auth/Auth';
import Registration from '../Registration/Registration';
import Logout from '../Logout/Logout';
import classes from './App.module.css';
import TaskList from '../TaskList/TaskList';
import * as actions from '../../store/actions';

const mapStateToProps = state => {
  const props = {
    isAuthenticated: !!state.auth.token,
  };
  return props;
};

const actionCreators = {
  autoLogin: actions.autoLogin,
};

class App extends React.PureComponent {
  componentDidMount() {
    const { autoLogin } = this.props;
    autoLogin();
  }

  render() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return (
        <div className={classes.App}>
          <>
            <Redirect to="/tasks" component={Tasks} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/taskList" component={TaskList} />
            <Route path="/logout" component={Logout} />
          </>
        </div>
      );
    }
    return (
      <div className={classes.Auth}>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/registration" component={Registration} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, actionCreators)(App));
