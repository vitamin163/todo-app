import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tasks from '../Tasks/Tasks';
import Auth from '../Auth/Auth';
import Registration from '../Registration/Registration';
import Logout from '../Logout/Logout';
import classes from './App.module.css';

const mapStateToProps = state => {
  const props = {
    isAuthenticated: !!state.auth.token,
  };
  return props;
};

class App extends React.PureComponent {
  render() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return (
        <div className={classes.App}>
          <>
            <Redirect to="/tasks" component={Tasks} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/logout" component={Logout} />
          </>
        </div>
      );
    }
    return (
      <div className={classes.App}>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/registration" component={Registration} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(App));
